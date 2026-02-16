"""
Database Configuration and Connection Management for IncluScore
Handles PostgreSQL connection via Supabase
"""

import os
import asyncio
import asyncpg
from typing import Optional, Dict, Any, List
import json
from datetime import datetime
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables from .env.local
load_dotenv(".env.local")

# Setup logging
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Singleton database manager for PostgreSQL connections via Supabase."""
    
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            # Load environment variables again to be sure
            load_dotenv(".env.local")
            
            self.supabase_url = os.getenv('SUPABASE_URL')
            self.supabase_key = os.getenv('SUPABASE_KEY')
            
            # Debug: Print what we found (without sensitive data)
            if self.supabase_url:
                logger.info(f"Supabase URL found: {self.supabase_url[:50]}...")
            else:
                logger.error("SUPABASE_URL not found in environment variables")
            
            if self.supabase_key:
                logger.info(f"Supabase key found: {self.supabase_key[:20]}...")
            else:
                logger.error("SUPABASE_KEY not found in environment variables")
            
            # Only build database URL if we have the required variables
            if self.supabase_url and self.supabase_key:
                try:
                    self.database_url = self._build_database_url()
                    logger.info("Database URL built successfully")
                except Exception as e:
                    logger.error(f"Failed to build database URL: {e}")
                    self.database_url = None
            else:
                self.database_url = None
                
            self.initialized = True
    
    def _build_database_url(self) -> str:
        """Build PostgreSQL connection URL from Supabase URL."""
        if not self.supabase_url:
            current_dir = os.getcwd()
            env_path = os.path.join(current_dir, ".env.local")
            raise ValueError(
                f"SUPABASE_URL environment variable not set.\n"
                f"Current directory: {current_dir}\n"
                f"Looking for .env.local at: {env_path}\n"
                f"File exists: {os.path.exists(env_path)}\n"
                f"Please ensure your .env.local file contains:\n"
                f"SUPABASE_URL=https://your-project-id.supabase.co\n"
                f"SUPABASE_KEY=your-anon-key"
            )
        
        # Extract project ID from Supabase URL
        # Format: https://[project-id].supabase.co
        project_id = self.supabase_url.replace('https://', '').replace('.supabase.co', '')
        
        # For Supabase, we need the database password from the dashboard
        db_password = os.getenv('SUPABASE_DB_PASSWORD')
        
        if not db_password:
            # Try service role key
            db_password = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
        if not db_password:
            # For initial testing, we'll try the anon key (may not work for all operations)
            db_password = self.supabase_key
            logger.warning("Using anon key as database password. This may not work for all operations.")
        
        # URL encode the password if it contains special characters
        encoded_password = quote_plus(db_password)
        
        # Try different Supabase connection formats
        connection_urls = [
            # Direct connection (most common)
            f"postgresql://postgres:{encoded_password}@db.{project_id}.supabase.co:5432/postgres",
            # Connection pooler format 1
            f"postgresql://postgres.{project_id}:{encoded_password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
            # Connection pooler format 2 
            f"postgresql://postgres:{encoded_password}@db.{project_id}.supabase.co:6543/postgres",
            # Alternative region format (use correct region)
            f"postgresql://postgres.{project_id}:{encoded_password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
            # Session mode pooler
            f"postgresql://postgres.{project_id}:{encoded_password}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
        ]
        
        # Return the first URL for now, we'll try others in initialize_pool if this fails
        self.alternative_urls = connection_urls[1:]
        return connection_urls[0]
    
    async def initialize_pool(self):
        """Initialize the connection pool."""
        if self._pool is None:
            if not self.database_url:
                raise ValueError("Database URL not configured. Check environment variables.")
                
            # Try multiple connection URLs
            urls_to_try = [self.database_url] + getattr(self, 'alternative_urls', [])
            
            for i, url in enumerate(urls_to_try):
                try:
                    logger.info(f"Attempting database connection {i+1}/{len(urls_to_try)}...")
                    self._pool = await asyncpg.create_pool(
                        url,
                        min_size=1,
                        max_size=10,
                        command_timeout=60,
                        ssl='prefer'
                    )
                    logger.info(f"✅ Database connection successful with URL format {i+1}")
                    return
                except Exception as e:
                    logger.warning(f"❌ Connection attempt {i+1} failed: {e}")
                    if i == len(urls_to_try) - 1:  # Last attempt
                        logger.error("All connection attempts failed")
                        raise Exception(
                            f"Failed to connect to database after {len(urls_to_try)} attempts. "
                            f"Last error: {e}. "
                            f"Please check your SUPABASE_DB_PASSWORD in .env.local file."
                        )
    
    async def close_pool(self):
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("Database connection pool closed")
    
    @asynccontextmanager
    async def get_connection(self):
        """Get a database connection from the pool."""
        if self._pool is None:
            await self.initialize_pool()
        
        async with self._pool.acquire() as connection:
            yield connection
    
    async def execute_query(self, query: str, *args) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results as list of dictionaries."""
        async with self.get_connection() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(row) for row in rows]
    
    async def execute_query_one(self, query: str, *args) -> Optional[Dict[str, Any]]:
        """Execute a SELECT query and return single result as dictionary."""
        async with self.get_connection() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None
    
    async def execute_command(self, query: str, *args) -> str:
        """Execute an INSERT/UPDATE/DELETE command and return status."""
        async with self.get_connection() as conn:
            result = await conn.execute(query, *args)
            return result

# Global database manager instance
db_manager = DatabaseManager()

class BeneficiaryRepository:
    """Repository for beneficiary-related database operations."""
    
    async def get_all_beneficiaries(self, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all beneficiaries with their latest scores."""
        query = """
        SELECT 
            b.*,
            u.email, u.first_name, u.last_name,
            sh.credit_score, sh.risk_category, sh.explanation,
            sh.calculated_at as last_score_update
        FROM beneficiaries b
        JOIN users u ON b.user_id = u.id
        LEFT JOIN LATERAL (
            SELECT credit_score, risk_category, explanation, calculated_at
            FROM score_history 
            WHERE beneficiary_id = b.id 
            ORDER BY calculated_at DESC 
            LIMIT 1
        ) sh ON true
        WHERE ($1::uuid IS NULL OR u.tenant_id = $1::uuid)
        ORDER BY b.created_at DESC
        """
        return await db_manager.execute_query(query, tenant_id)
    
    async def get_beneficiary_by_id(self, beneficiary_id: str) -> Optional[Dict[str, Any]]:
        """Get beneficiary by ID with latest score."""
        query = """
        SELECT 
            b.*,
            u.email, u.first_name, u.last_name,
            sh.credit_score, sh.risk_category, sh.explanation,
            sh.feature_values, sh.feature_impacts
        FROM beneficiaries b
        JOIN users u ON b.user_id = u.id
        LEFT JOIN LATERAL (
            SELECT credit_score, risk_category, explanation, feature_values, feature_impacts
            FROM score_history 
            WHERE beneficiary_id = b.id 
            ORDER BY calculated_at DESC 
            LIMIT 1
        ) sh ON true
        WHERE b.id = $1::uuid
        """
        return await db_manager.execute_query_one(query, beneficiary_id)
    
    async def get_beneficiary_by_code(self, beneficiary_code: str) -> Optional[Dict[str, Any]]:
        """Get beneficiary by beneficiary code."""
        query = """
        SELECT 
            b.*,
            u.email, u.first_name, u.last_name
        FROM beneficiaries b
        JOIN users u ON b.user_id = u.id
        WHERE b.beneficiary_code = $1
        """
        return await db_manager.execute_query_one(query, beneficiary_code)
    
    async def create_beneficiary(self, user_id: str, beneficiary_data: Dict[str, Any], created_by: str) -> str:
        """Create a new beneficiary."""
        query = """
        INSERT INTO beneficiaries (
            user_id, beneficiary_code, date_of_birth, gender, marital_status,
            education_level, address, monthly_income, employment_type, employer_name,
            loan_repayment_status, loan_tenure_months, electricity_bill_paid_on_time,
            mobile_recharge_frequency, is_high_need, created_by
        ) VALUES (
            $1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::uuid
        ) RETURNING id
        """
        
        result = await db_manager.execute_query_one(
            query,
            user_id,
            beneficiary_data.get('beneficiary_code'),
            beneficiary_data.get('date_of_birth'),
            beneficiary_data.get('gender'),
            beneficiary_data.get('marital_status'),
            beneficiary_data.get('education_level'),
            json.dumps(beneficiary_data.get('address', {})),
            beneficiary_data.get('monthly_income'),
            beneficiary_data.get('employment_type'),
            beneficiary_data.get('employer_name'),
            beneficiary_data.get('loan_repayment_status', 0),
            beneficiary_data.get('loan_tenure_months', 0),
            beneficiary_data.get('electricity_bill_paid_on_time', 0),
            beneficiary_data.get('mobile_recharge_frequency', 0),
            beneficiary_data.get('is_high_need', False),
            created_by
        )
        
        return result['id'] if result else None
    
    async def update_beneficiary(self, beneficiary_id: str, updates: Dict[str, Any]) -> bool:
        """Update beneficiary data."""
        # Build dynamic update query
        set_clauses = []
        values = []
        param_count = 1
        
        for key, value in updates.items():
            if key == 'address' and isinstance(value, dict):
                value = json.dumps(value)
            set_clauses.append(f"{key} = ${param_count}")
            values.append(value)
            param_count += 1
        
        if not set_clauses:
            return False
        
        set_clauses.append(f"updated_at = ${param_count}")
        values.append(datetime.utcnow())
        param_count += 1
        
        values.append(beneficiary_id)
        
        query = f"""
        UPDATE beneficiaries 
        SET {', '.join(set_clauses)}
        WHERE id = ${param_count}::uuid
        """
        
        result = await db_manager.execute_command(query, *values)
        return result == "UPDATE 1"

class ScoreHistoryRepository:
    """Repository for score history operations."""
    
    async def save_score(self, beneficiary_id: str, score_data: Dict[str, Any], calculated_by: str) -> str:
        """Save a new credit score calculation."""
        query = """
        INSERT INTO score_history (
            beneficiary_id, credit_score, risk_category, confidence_level,
            model_version, feature_values, feature_impacts, explanation,
            improvement_suggestions, calculation_trigger, calculated_by
        ) VALUES (
            $1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::uuid
        ) RETURNING id
        """
        
        result = await db_manager.execute_query_one(
            query,
            beneficiary_id,
            score_data.get('credit_score'),
            score_data.get('risk_category'),
            score_data.get('confidence_level'),
            score_data.get('model_version'),
            json.dumps(score_data.get('feature_values', {})),
            json.dumps(score_data.get('feature_impacts', {})),
            score_data.get('explanation'),
            json.dumps(score_data.get('improvement_suggestions', [])),
            score_data.get('calculation_trigger', 'manual'),
            calculated_by
        )
        
        return result['id'] if result else None
    
    async def get_score_history(self, beneficiary_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get score history for a beneficiary."""
        query = """
        SELECT *
        FROM score_history
        WHERE beneficiary_id = $1::uuid
        ORDER BY calculated_at DESC
        LIMIT $2
        """
        return await db_manager.execute_query(query, beneficiary_id, limit)

class UserRepository:
    """Repository for user management operations."""
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        query = "SELECT * FROM users WHERE email = $1"
        return await db_manager.execute_query_one(query, email)
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        query = "SELECT * FROM users WHERE id = $1::uuid"
        return await db_manager.execute_query_one(query, user_id)
    
    async def get_user_by_clerk_id(self, clerk_user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by Clerk user ID."""
        query = "SELECT * FROM users WHERE clerk_user_id = $1"
        return await db_manager.execute_query_one(query, clerk_user_id)
    
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user."""
        query = """
        INSERT INTO users (
            clerk_user_id, email, first_name, last_name, role, phone, tenant_id
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7::uuid
        ) RETURNING id
        """
        
        result = await db_manager.execute_query_one(
            query,
            user_data.get('clerk_user_id'),
            user_data.get('email'),
            user_data.get('first_name'),
            user_data.get('last_name'),
            user_data.get('role', 'beneficiary'),
            user_data.get('phone'),
            user_data.get('tenant_id')
        )
        
        return result['id'] if result else None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user information."""
        # Build dynamic update query
        set_clauses = []
        values = []
        param_count = 1
        
        for field, value in update_data.items():
            if field != 'id':  # Don't update ID
                if value == 'NOW()':
                    set_clauses.append(f"{field} = NOW()")
                else:
                    set_clauses.append(f"{field} = ${param_count}")
                    values.append(value)
                    param_count += 1
        
        if not set_clauses:
            return False
        
        # Add user_id as the last parameter
        values.append(user_id)
        
        query = f"""
        UPDATE users 
        SET {', '.join(set_clauses)}
        WHERE id = ${param_count}::uuid
        """
        
        result = await db_manager.execute_query(query, *values)
        return result is not None
    
    async def update_user_role(self, user_id: str, new_role: str) -> bool:
        """Update user role."""
        query = """
        UPDATE users 
        SET role = $1, updated_at = NOW()
        WHERE id = $2::uuid
        """
        
        result = await db_manager.execute_query(query, new_role, user_id)
        return result is not None
    
    async def get_all_users(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all users with pagination."""
        query = """
        SELECT * FROM users 
        ORDER BY created_at DESC 
        LIMIT $1
        """
        return await db_manager.execute_query(query, limit)
    
    async def deactivate_user(self, user_id: str) -> bool:
        """Deactivate a user account."""
        query = """
        UPDATE users 
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = $1::uuid
        """
        
        result = await db_manager.execute_query(query, user_id)
        return result is not None

# Repository instances
beneficiary_repo = BeneficiaryRepository()
score_repo = ScoreHistoryRepository()
user_repo = UserRepository()