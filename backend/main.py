"""
FastAPI Backend for IncluScore
Dynamic Credit Scoring and Guidance System with PostgreSQL Database
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import pandas as pd
import os
import uvicorn
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

# Import our custom modules
from database import (
    db_manager, beneficiary_repo, score_repo, user_repo,
    BeneficiaryRepository, ScoreHistoryRepository, UserRepository
)
from model import (
    train_initial_model, 
    predict_score, 
    predict_risk_need, 
    update_model,
    ZenithScoreModel
)
from explainer import generate_explanation, get_feature_impacts

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database lifecycle management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await db_manager.initialize_pool()
        logger.info("Database connection established")
        
        # Initialize ML model
        await initialize_system()
        logger.info("System initialization completed")
    except Exception as e:
        logger.error(f"Failed to initialize system: {e}")
        raise
    
    yield
    
    # Shutdown
    try:
        await db_manager.close_pool()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Initialize FastAPI app with lifespan management
app = FastAPI(
    title="IncluScore - Dynamic Credit Scoring API",
    description="AI-powered credit scoring system with dynamic learning and guidance",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    details: Optional[str] = None

class SuccessResponse(BaseModel):
    status: str = "success"
    message: str
    data: Optional[Dict[str, Any]] = None

class BeneficiaryResponse(BaseModel):
    id: str
    beneficiary_code: str
    data: Dict[str, Any]
    score: Optional[int] = None
    risk_category: Optional[str] = None
    explanation: Optional[str] = None

class BeneficiaryListResponse(BaseModel):
    status: str = "success"
    beneficiaries: List[Dict[str, Any]]
    total: int

class UpdateRequest(BaseModel):
    beneficiary_id: str
    new_data: Dict[str, Any]

class SimulateRequest(BaseModel):
    current_data: Dict[str, Any]
    hypothetical_changes: Dict[str, Any]

class SimulateResponse(BaseModel):
    current_score: int
    projected_score: int
    score_change: int
    explanation: str

class UserCreateRequest(BaseModel):
    clerk_user_id: Optional[str] = None
    email: str
    first_name: str
    last_name: str
    role: str = "beneficiary"
    phone: Optional[str] = None
    tenant_id: Optional[str] = None

async def initialize_system():
    """Initialize the system by ensuring ML model is trained."""
    try:
        # Check if we have any beneficiaries in the database
        beneficiaries = await beneficiary_repo.get_all_beneficiaries()
        
        if len(beneficiaries) > 0:
            logger.info(f"Found {len(beneficiaries)} beneficiaries in database")
            
            # Check if model exists and train if needed
            zenith_model = ZenithScoreModel()
            if not os.path.exists("uday_model.joblib"):
                logger.info("Training initial model from database data...")
                # Convert database data to training format and train model
                await train_model_from_database()
            else:
                logger.info("Loading existing model...")
                zenith_model.load_model()
        else:
            logger.warning("No beneficiaries found in database. Model training skipped.")
            
    except Exception as e:
        logger.error(f"Error during system initialization: {e}")
        # Don't fail startup, just log the error

async def train_model_from_database():
    """Train the model using data from the database."""
    try:
        # Get all beneficiaries with their score history
        beneficiaries = await beneficiary_repo.get_all_beneficiaries()
        
        # Convert to training data format
        training_data = []
        for ben in beneficiaries:
            if ben.get('credit_score') is not None:
                training_data.append({
                    'beneficiary_id': ben['id'],
                    'loan_repayment_status': ben.get('loan_repayment_status', 0),
                    'loan_tenure_months': ben.get('loan_tenure_months', 0),
                    'electricity_bill_paid_on_time': ben.get('electricity_bill_paid_on_time', 0),
                    'mobile_recharge_frequency': ben.get('mobile_recharge_frequency', 0),
                    'is_high_need': int(ben.get('is_high_need', False)),
                    'monthly_income': ben.get('monthly_income', 0),
                    'employment_type': ben.get('employment_type', 'unemployed'),
                    'creditworthy': 1 if ben.get('credit_score', 0) >= 600 else 0
                })
        
        if len(training_data) >= 5:  # Minimum data required for training
            import pandas as pd
            df = pd.DataFrame(training_data)
            
            # Encode employment_type
            employment_mapping = {'unemployed': 0, 'self_employed': 1, 'salaried': 2, 'business_owner': 3}
            df['employment_type'] = df['employment_type'].map(employment_mapping).fillna(0)
            
            # Train the model
            zenith_model = ZenithScoreModel()
            result = zenith_model.train_initial_model_from_dataframe(df)
            logger.info(f"Model training completed: {result}")
        else:
            logger.warning(f"Insufficient training data: {len(training_data)} records")
            
    except Exception as e:
        logger.error(f"Error training model from database: {e}")

# Helper function to convert beneficiary data for ML model
def prepare_beneficiary_for_ml(beneficiary_data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database beneficiary data to ML model format."""
    employment_mapping = {'unemployed': 0, 'self_employed': 1, 'salaried': 2, 'business_owner': 3}
    
    return {
        'loan_repayment_status': beneficiary_data.get('loan_repayment_status', 0),
        'loan_tenure_months': beneficiary_data.get('loan_tenure_months', 0),
        'electricity_bill_paid_on_time': beneficiary_data.get('electricity_bill_paid_on_time', 0),
        'mobile_recharge_frequency': beneficiary_data.get('mobile_recharge_frequency', 0),
        'is_high_need': int(beneficiary_data.get('is_high_need', False)),
        'age': beneficiary_data.get('age', 30),
        'monthly_income': beneficiary_data.get('monthly_income', 0),
        'employment_type': employment_mapping.get(beneficiary_data.get('employment_type', 'unemployed'), 0)
    }
    
    # Train model if it doesn't exist
    if not os.path.exists("zenith_model.joblib"):
        print("Training initial model...")
        train_initial_model("beneficiaries.csv")
        print("Model training completed!")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to IncluScore - Dynamic Credit Scoring API",
        "version": "2.0.0",
        "features": [
            "Multi-user authentication with role-based access",
            "Dynamic credit scoring with PostgreSQL database",
            "Real-time score tracking and history",
            "ML model versioning and continuous learning"
        ],
        "endpoints": {
            "beneficiary": "/beneficiary/{beneficiary_id}",
            "beneficiaries": "/beneficiaries",
            "update": "/update",
            "simulate": "/simulate",
            "users": "/users"
        }
    }

@app.get("/beneficiaries", response_model=BeneficiaryListResponse)
async def get_all_beneficiaries(tenant_id: Optional[str] = None, email: Optional[str] = None):
    """
    Get all beneficiaries with their latest scores.
    
    Args:
        tenant_id: Optional tenant ID for multi-tenant filtering
        email: Optional email filter to find specific beneficiary
        
    Returns:
        List of all beneficiaries with their latest credit scores (or single beneficiary if email provided)
    """
    try:
        beneficiaries = await beneficiary_repo.get_all_beneficiaries(tenant_id)
        
        # Filter by email if provided
        if email:
            beneficiaries = [ben for ben in beneficiaries if ben.get('email', '').lower() == email.lower()]
        
        # Format the data for the frontend
        formatted_beneficiaries = []
        for ben in beneficiaries:
            formatted_ben = {
                "id": str(ben['id']),
                "beneficiary_code": ben.get('beneficiary_code', ''),
                "name": f"{ben.get('first_name', '')} {ben.get('last_name', '')}".strip(),
                "email": ben.get('email', ''),
                "monthly_income": ben.get('monthly_income', 0),
                "employment_type": ben.get('employment_type', 'unemployed'),
                "credit_score": ben.get('credit_score'),
                "risk_category": ben.get('risk_category'),
                "is_high_need": ben.get('is_high_need', False),
                "kyc_status": ben.get('kyc_status', 'pending'),
                "created_at": ben.get('created_at').isoformat() if ben.get('created_at') else None,
                "last_score_update": ben.get('last_score_update').isoformat() if ben.get('last_score_update') else None
            }
            formatted_beneficiaries.append(formatted_ben)
        
        return BeneficiaryListResponse(
            beneficiaries=formatted_beneficiaries,
            total=len(formatted_beneficiaries)
        )
        
    except Exception as e:
        logger.error(f"Error fetching beneficiaries: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error fetching beneficiaries",
                details=str(e)
            ).dict()
        )

@app.get("/beneficiary/{beneficiary_id}", response_model=BeneficiaryResponse)
async def get_beneficiary(beneficiary_id: str):
    """
    Get beneficiary information, current score, risk category, and explanation.
    
    Args:
        beneficiary_id: UUID of the beneficiary
        
    Returns:
        Complete beneficiary profile with AI-generated insights
    """
    try:
        # Get beneficiary from database
        beneficiary = await beneficiary_repo.get_beneficiary_by_id(beneficiary_id)
        
        if not beneficiary:
            logger.warning(f"Beneficiary {beneficiary_id} not found")
            raise HTTPException(
                status_code=404,
                detail=ErrorResponse(
                    message=f"Beneficiary not found",
                    details="Please check the beneficiary ID and try again"
                ).dict()
            )
        
        # Prepare data for ML prediction if no recent score exists
        score = beneficiary.get('credit_score')
        risk_category = beneficiary.get('risk_category')
        explanation = beneficiary.get('explanation')
        
        if score is None:
            # Calculate new score
            ml_data = prepare_beneficiary_for_ml(beneficiary)
            score = predict_score(ml_data)
            risk_category = predict_risk_need(ml_data)
            explanation = generate_explanation(ml_data)
            
            # Save the new score to database
            score_data = {
                'credit_score': score,
                'risk_category': risk_category,
                'explanation': explanation,
                'model_version': 'v1.2.0',
                'feature_values': ml_data,
                'calculation_trigger': 'api_request',
                'confidence_level': 85.0
            }
            
            await score_repo.save_score(beneficiary_id, score_data, 'system')
        
        # Prepare response data with proper formatting for frontend
        response_data = {
            'beneficiary_id': beneficiary.get('beneficiary_code', str(beneficiary['id'])),
            'age': beneficiary.get('age', 30),
            'employment_type': beneficiary.get('employment_type', 0),  # 0=unemployed, 1=self_employed, 2=salaried
            'monthly_income': beneficiary.get('monthly_income', 0),
            'loan_repayment_status': beneficiary.get('loan_repayment_status', 0),  # 1=good, 0=poor
            'loan_tenure_months': beneficiary.get('loan_tenure_months', 0),
            'electricity_bill_paid_on_time': beneficiary.get('electricity_bill_paid_on_time', 0),  # 1=yes, 0=no
            'mobile_recharge_frequency': beneficiary.get('mobile_recharge_frequency', 0),
            'is_high_need': beneficiary.get('is_high_need', False),
            'credit_score': score,
            'risk_category': risk_category,
            'explanation': explanation,
            'name': f"{beneficiary.get('first_name', '')} {beneficiary.get('last_name', '')}".strip() or f"Beneficiary {beneficiary.get('beneficiary_code', beneficiary['id'])}",
            'email': beneficiary.get('email', ''),
            'gender': beneficiary.get('gender', 'Not specified'),
            'created_at': beneficiary.get('created_at').isoformat() if beneficiary.get('created_at') else None,
            'updated_at': beneficiary.get('updated_at').isoformat() if beneficiary.get('updated_at') else None
        }
        
        return BeneficiaryResponse(
            id=str(beneficiary['id']),
            beneficiary_code=beneficiary.get('beneficiary_code', ''),
            data=response_data,
            score=score,
            risk_category=risk_category,
            explanation=explanation
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing beneficiary data: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error processing beneficiary data",
                details=str(e)
            ).dict()
        )

@app.post("/update")
async def update_beneficiary_model(request: UpdateRequest):
    """
    Update beneficiary data and retrain model with new information.
    
    Args:
        request: Update request containing beneficiary ID and new data
        
    Returns:
        Status of the update operation
    """
    try:
        # Validate input data first
        model_instance = ZenithScoreModel()
        is_valid, error_msg = model_instance.validate_data(request.new_data)
        
        if not is_valid:
            logger.warning(f"Invalid data for beneficiary {request.beneficiary_id}: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="Invalid input data",
                    details=error_msg
                ).dict()
            )
        
        # Update beneficiary in database
        success = await beneficiary_repo.update_beneficiary(request.beneficiary_id, request.new_data)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=ErrorResponse(
                    message="Beneficiary not found or update failed",
                    details="Please check the beneficiary ID"
                ).dict()
            )
        
        # Recalculate score with new data
        beneficiary = await beneficiary_repo.get_beneficiary_by_id(request.beneficiary_id)
        if beneficiary:
            ml_data = prepare_beneficiary_for_ml(beneficiary)
            new_score = predict_score(ml_data)
            new_risk_category = predict_risk_need(ml_data)
            new_explanation = generate_explanation(ml_data)
            
            # Save new score to history
            score_data = {
                'credit_score': new_score,
                'risk_category': new_risk_category,
                'explanation': new_explanation,
                'model_version': 'v1.2.0',
                'feature_values': ml_data,
                'calculation_trigger': 'data_update',
                'confidence_level': 90.0
            }
            
            await score_repo.save_score(request.beneficiary_id, score_data, 'system')
            
            # Update model with new data point (online learning)
            new_data_with_target = {**ml_data, 'creditworthy': 1 if new_score >= 600 else 0}
            model_update_result = update_model(new_data_with_target)
            
            return SuccessResponse(
                message="Beneficiary updated and model retrained successfully",
                data={
                    "beneficiary_id": request.beneficiary_id,
                    "new_score": new_score,
                    "new_risk_category": new_risk_category,
                    "model_update": model_update_result
                }
            )
        
        return SuccessResponse(
            message="Beneficiary updated successfully",
            data={"beneficiary_id": request.beneficiary_id}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating beneficiary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error updating beneficiary",
                details=str(e)
            ).dict()
        )

@app.post("/simulate", response_model=SimulateResponse)
async def simulate_score(request: SimulateRequest):
    """
    Simulate future score based on hypothetical changes.
    This is the core "What-If" feature of IncluScore.
    
    Args:
        request: Simulation request with current data and hypothetical changes
        
    Returns:
        Current score, projected score, and explanation
    """
    try:
        # Calculate current score
        current_score = predict_score(request.current_data)
        
        # Apply hypothetical changes
        projected_data = {**request.current_data, **request.hypothetical_changes}
        projected_score = predict_score(projected_data)
        
        # Calculate score change
        score_change = projected_score - current_score
        
        # Generate explanation for the projection
        explanation = generate_explanation(projected_data)
        
        # Add specific guidance based on the changes
        if score_change > 0:
            explanation += f" These improvements could increase your score by {score_change} points."
        elif score_change < 0:
            explanation += f" These changes might decrease your score by {abs(score_change)} points."
        else:
            explanation += " These changes would have minimal impact on your current score."
        
        return SimulateResponse(
            current_score=current_score,
            projected_score=projected_score,
            score_change=score_change,
            explanation=explanation
        )
        
    except Exception as e:
        logger.error(f"Error simulating score: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=ErrorResponse(
                message="Error simulating score",
                details=str(e)
            ).dict()
        )

@app.post("/users", response_model=SuccessResponse)
async def create_user(request: UserCreateRequest):
    """
    Create a new user in the system.
    
    Args:
        request: User creation request with email, name, role, etc.
        
    Returns:
        Success response with created user ID
    """
    try:
        # Check if user already exists
        existing_user = await user_repo.get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="User already exists",
                    details="A user with this email already exists"
                ).dict()
            )
        
        # Create user
        user_data = {
            'clerk_user_id': request.clerk_user_id,
            'email': request.email,
            'first_name': request.first_name,
            'last_name': request.last_name,
            'role': request.role,
            'phone': request.phone,
            'tenant_id': request.tenant_id or '550e8400-e29b-41d4-a716-446655440001'  # Default tenant
        }
        
        user_id = await user_repo.create_user(user_data)
        
        if not user_id:
            raise HTTPException(
                status_code=500,
                detail=ErrorResponse(
                    message="Failed to create user",
                    details="Database operation failed"
                ).dict()
            )
        
        return SuccessResponse(
            message="User created successfully",
            data={"user_id": user_id, "email": request.email, "role": request.role}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error creating user",
                details=str(e)
            ).dict()
        )

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    """
    Get user information by user ID.
    
    Args:
        user_id: UUID of the user
        
    Returns:
        User information including role and profile
    """
    try:
        user = await user_repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=404,
                detail=ErrorResponse(
                    message="User not found",
                    details="No user found with the provided ID"
                ).dict()
            )
        
        # Format user data
        user_data = {
            "id": str(user['id']),
            "clerk_user_id": user['clerk_user_id'],
            "email": user['email'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "role": user['role'],
            "phone": user.get('phone'),
            "is_active": user.get('is_active', True),
            "created_at": user['created_at'].isoformat() if user.get('created_at') else None,
            "last_login": user['last_login'].isoformat() if user.get('last_login') else None
        }
        
        return {"user": user_data}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error fetching user",
                details=str(e)
            ).dict()
        )

@app.get("/users/clerk/{clerk_user_id}")
async def get_user_by_clerk_id(clerk_user_id: str):
    """
    Get user information by Clerk user ID for authentication integration.
    
    Args:
        clerk_user_id: Clerk user identifier
        
    Returns:
        User information including role and permissions
    """
    try:
        user = await user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            # User not found in database - this might be a new user
            return {"user": None, "needs_registration": True}
        
        # Format user data with role information
        user_data = {
            "id": str(user['id']),
            "clerk_user_id": user['clerk_user_id'],
            "email": user['email'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "role": user['role'],
            "phone": user.get('phone'),
            "is_active": user.get('is_active', True),
            "created_at": user['created_at'].isoformat() if user.get('created_at') else None,
            "last_login": user['last_login'].isoformat() if user.get('last_login') else None,
            "permissions": get_role_permissions(user['role'])
        }
        
        return {"user": user_data, "needs_registration": False}
        
    except Exception as e:
        logger.error(f"Error fetching user by Clerk ID: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error fetching user",
                details=str(e)
            ).dict()
        )

@app.put("/users/{user_id}/role")
async def update_user_role(user_id: str, role_update: dict):
    """
    Update user role (admin only operation).
    
    Args:
        user_id: UUID of the user
        role_update: Dictionary containing new role
        
    Returns:
        Success response with updated user info
    """
    try:
        new_role = role_update.get('role')
        if not new_role:
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="Invalid request",
                    details="Role field is required"
                ).dict()
            )
        
        # Validate role
        valid_roles = ['admin', 'loan_officer', 'beneficiary', 'bank_manager', 'auditor']
        if new_role not in valid_roles:
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="Invalid role",
                    details=f"Role must be one of: {', '.join(valid_roles)}"
                ).dict()
            )
        
        # Update user role
        success = await user_repo.update_user_role(user_id, new_role)
        if not success:
            raise HTTPException(
                status_code=404,
                detail=ErrorResponse(
                    message="User not found or update failed",
                    details="Could not update user role"
                ).dict()
            )
        
        return SuccessResponse(
            message="User role updated successfully",
            data={"user_id": user_id, "new_role": new_role}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user role: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error updating user role",
                details=str(e)
            ).dict()
        )

@app.post("/users/sync-clerk")
async def sync_clerk_user(clerk_sync: dict):
    """
    Sync user data from Clerk authentication system.
    
    Args:
        clerk_sync: Dictionary containing Clerk user data
        
    Returns:
        Success response with user sync status
    """
    try:
        clerk_user_id = clerk_sync.get('clerk_user_id')
        email = clerk_sync.get('email')
        first_name = clerk_sync.get('first_name')
        last_name = clerk_sync.get('last_name')
        
        if not clerk_user_id or not email:
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="Invalid sync data",
                    details="clerk_user_id and email are required"
                ).dict()
            )
        
        # Check if user already exists
        existing_user = await user_repo.get_user_by_clerk_id(clerk_user_id)
        
        if existing_user:
            # Update existing user
            update_data = {
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'last_login': 'NOW()'
            }
            await user_repo.update_user(str(existing_user['id']), update_data)
            
            return SuccessResponse(
                message="User synced successfully",
                data={
                    "user_id": str(existing_user['id']),
                    "action": "updated",
                    "role": existing_user['role']
                }
            )
        else:
            # Create new user with default beneficiary role
            user_data = {
                'clerk_user_id': clerk_user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'role': 'beneficiary',  # Default role for new users
                'tenant_id': '550e8400-e29b-41d4-a716-446655440001'  # Default tenant
            }
            
            user_id = await user_repo.create_user(user_data)
            
            return SuccessResponse(
                message="User created and synced successfully",
                data={
                    "user_id": user_id,
                    "action": "created",
                    "role": "beneficiary"
                }
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing Clerk user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error syncing user",
                details=str(e)
            ).dict()
        )

def get_role_permissions(role: str) -> List[str]:
    """
    Get permissions for a given role.
    
    Args:
        role: User role
        
    Returns:
        List of permissions for the role
    """
    permissions_map = {
        'admin': [
            'manage_users',
            'view_all_beneficiaries',
            'manage_system_settings',
            'view_analytics',
            'manage_roles',
            'view_audit_logs'
        ],
        'loan_officer': [
            'view_beneficiaries',
            'assess_creditworthiness',
            'process_applications',
            'view_risk_analytics',
            'update_beneficiary_data'
        ],
        'beneficiary': [
            'view_own_profile',
            'view_own_score',
            'view_score_history',
            'apply_for_loans',
            'update_own_profile'
        ],
        'bank_manager': [
            'view_portfolio_analytics',
            'view_performance_metrics',
            'view_risk_reports',
            'view_business_intelligence',
            'approve_large_loans'
        ],
        'auditor': [
            'view_audit_logs',
            'view_compliance_reports',
            'view_risk_analytics',
            'generate_reports'
        ]
    }
    
    return permissions_map.get(role, [])

@app.get("/users/all")
async def list_all_users():
    """
    List all users in the system (admin only).
    
    Returns:
        List of all users with their basic information
    """
    try:
        users = await user_repo.get_all_users()
        return SuccessResponse(
            message="Users retrieved successfully",
            data={"users": users, "total_count": len(users)}
        )
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error retrieving users",
                details=str(e)
            ).dict()
        )

@app.get("/users/stats")
async def get_user_statistics():
    """
    Get user statistics by role (admin only).
    
    Returns:
        User statistics breakdown by role
    """
    try:
        stats = await user_repo.get_user_stats()
        return SuccessResponse(
            message="User statistics retrieved successfully",
            data={"statistics": stats}
        )
    except Exception as e:
        logger.error(f"Error retrieving user stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error retrieving user statistics",
                details=str(e)
            ).dict()
        )

@app.get("/score-history/{beneficiary_id}")
async def get_score_history(beneficiary_id: str, limit: int = 10):
    """
    Get credit score history for a beneficiary.
    
    Args:
        beneficiary_id: UUID of the beneficiary
        limit: Number of historical records to return
        
    Returns:
        List of historical scores with timestamps and explanations
    """
    try:
        history = await score_repo.get_score_history(beneficiary_id, limit)
        
        # Format the response
        formatted_history = []
        for record in history:
            formatted_record = {
                "id": str(record['id']),
                "credit_score": record['credit_score'],
                "risk_category": record['risk_category'],
                "confidence_level": record.get('confidence_level'),
                "explanation": record['explanation'],
                "calculated_at": record['calculated_at'].isoformat() if record['calculated_at'] else None,
                "calculation_trigger": record.get('calculation_trigger'),
                "model_version": record.get('model_version')
            }
            formatted_history.append(formatted_record)
        
        return {
            "beneficiary_id": beneficiary_id,
            "total_records": len(formatted_history),
            "history": formatted_history
        }
        
    except Exception as e:
        logger.error(f"Error fetching score history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error fetching score history",
                details=str(e)
            ).dict()
        )

@app.get("/feature-importance")
async def get_feature_importance():
    """
    Get feature importance from the trained model.
    
    Returns:
        Dictionary of feature names and their importance scores
    """
    try:
        model = ZenithScoreModel()
        importance = model.get_feature_importance()
        
        if not importance:
            raise HTTPException(
                status_code=500, 
                detail=ErrorResponse(
                    message="Model not available for feature importance",
                    details="Please ensure the model is trained and loaded"
                ).dict()
            )
        
        # Sort by importance
        sorted_importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        
        return {
            "feature_importance": sorted_importance,
            "total_features": len(sorted_importance)
        }
        
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error getting feature importance",
                details=str(e)
            ).dict()
        )

@app.post("/create-demo-beneficiary")
async def create_demo_beneficiary(email: str):
    """
    Create a demo beneficiary for testing with the provided email.
    
    Args:
        email: Email address for the demo beneficiary
        
    Returns:
        Created beneficiary data with score
    """
    try:
        # Create sample beneficiary data
        demo_data = {
            'email': email,
            'first_name': 'Demo',
            'last_name': 'User',
            'age': 35,
            'monthly_income': 25000,
            'employment_type': 2,  # Salaried
            'loan_repayment_status': 1,  # Good
            'loan_tenure_months': 12,
            'electricity_bill_paid_on_time': 1,  # Yes
            'mobile_recharge_frequency': 2,
            'is_high_need': False,
            'beneficiary_code': f'DEMO{hash(email) % 10000:04d}'
        }
        
        # Calculate credit score for demo data
        ml_data = prepare_beneficiary_for_ml(demo_data)
        credit_score = predict_score(ml_data)
        risk_category = predict_risk_need(ml_data)
        explanation = generate_explanation(ml_data)
        
        # Add calculated values
        demo_data.update({
            'credit_score': credit_score,
            'risk_category': risk_category,
            'explanation': explanation
        })
        
        return SuccessResponse(
            message="Demo beneficiary created successfully",
            data=demo_data
        )
        
    except Exception as e:
        logger.error(f"Error creating demo beneficiary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                message="Error creating demo beneficiary",
                details=str(e)
            ).dict()
        )

@app.get("/health")
async def health_check():
    """Health check endpoint with database connectivity status."""
    try:
        # Test database connectivity
        beneficiaries = await beneficiary_repo.get_all_beneficiaries()
        db_status = "connected"
        total_beneficiaries = len(beneficiaries)
    except Exception as e:
        db_status = f"error: {str(e)}"
        total_beneficiaries = 0
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "database_status": db_status,
        "model_available": os.path.exists("uday_model.joblib"),
        "total_beneficiaries": total_beneficiaries,
        "features": [
            "PostgreSQL database integration",
            "Multi-user authentication",
            "Real-time score calculation",
            "Score history tracking",
            "Model versioning"
        ]
    }

if __name__ == "__main__":
    # Run the server
    import sys
    # Check if running in a problematic environment
    reload_enabled = "--no-reload" not in sys.argv
    
    uvicorn.run(
        app,  # Use app object directly instead of string reference
        host="127.0.0.1",
        port=8000,
        reload=False,  # Disable reload to prevent immediate shutdown
        log_level="info"
    )