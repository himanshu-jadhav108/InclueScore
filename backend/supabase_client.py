"""
Alternative database connection using Supabase Python client
This approach uses REST API instead of direct PostgreSQL connection
"""

import os
import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

# Setup logging
logger = logging.getLogger(__name__)

class SupabaseManager:
    """Singleton Supabase client manager."""
    
    _instance = None
    _client = None
    
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
            
            if self.supabase_url and self.supabase_key:
                try:
                    self._client = create_client(self.supabase_url, self.supabase_key)
                    logger.info("✅ Supabase client initialized successfully")
                except Exception as e:
                    logger.error(f"❌ Failed to initialize Supabase client: {e}")
                    self._client = None
            else:
                logger.error("❌ Missing SUPABASE_URL or SUPABASE_KEY")
                self._client = None
                
            self.initialized = True
    
    @property
    def client(self) -> Optional[Client]:
        """Get the Supabase client."""
        return self._client
    
    def test_connection(self) -> bool:
        """Test the Supabase connection."""
        if not self._client:
            return False
        
        try:
            # Try to fetch a simple query to test connection
            result = self._client.table('users').select('id').limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False

class SupabaseBeneficiaryRepository:
    """Repository for beneficiary operations using Supabase client."""
    
    def __init__(self):
        self.supabase = SupabaseManager()
    
    def get_all_beneficiaries(self, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all beneficiaries with their latest scores."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            # Get beneficiaries with user info
            query = self.supabase.client.table('beneficiaries').select('''
                *,
                users!inner(email, first_name, last_name),
                score_history(credit_score, risk_category, explanation, calculated_at)
            ''')
            
            if tenant_id:
                query = query.eq('users.tenant_id', tenant_id)
            
            result = query.execute()
            
            # Process the data to get latest scores
            beneficiaries = []
            for ben in result.data:
                # Get latest score from score_history
                latest_score = None
                if ben.get('score_history'):
                    latest_score = max(ben['score_history'], key=lambda x: x['calculated_at'])
                
                formatted_ben = {
                    **ben,
                    'email': ben['users']['email'],
                    'first_name': ben['users']['first_name'],
                    'last_name': ben['users']['last_name'],
                    'credit_score': latest_score['credit_score'] if latest_score else None,
                    'risk_category': latest_score['risk_category'] if latest_score else None,
                    'explanation': latest_score['explanation'] if latest_score else None,
                    'last_score_update': latest_score['calculated_at'] if latest_score else None
                }
                beneficiaries.append(formatted_ben)
            
            return beneficiaries
            
        except Exception as e:
            logger.error(f"Error fetching beneficiaries: {e}")
            raise
    
    def get_beneficiary_by_id(self, beneficiary_id: str) -> Optional[Dict[str, Any]]:
        """Get beneficiary by ID with latest score."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            result = self.supabase.client.table('beneficiaries').select('''
                *,
                users!inner(email, first_name, last_name),
                score_history(credit_score, risk_category, explanation, feature_values, feature_impacts, calculated_at)
            ''').eq('id', beneficiary_id).execute()
            
            if not result.data:
                return None
            
            ben = result.data[0]
            
            # Get latest score
            latest_score = None
            if ben.get('score_history'):
                latest_score = max(ben['score_history'], key=lambda x: x['calculated_at'])
            
            return {
                **ben,
                'email': ben['users']['email'],
                'first_name': ben['users']['first_name'],
                'last_name': ben['users']['last_name'],
                'credit_score': latest_score['credit_score'] if latest_score else None,
                'risk_category': latest_score['risk_category'] if latest_score else None,
                'explanation': latest_score['explanation'] if latest_score else None,
                'feature_values': latest_score['feature_values'] if latest_score else None,
                'feature_impacts': latest_score['feature_impacts'] if latest_score else None
            }
            
        except Exception as e:
            logger.error(f"Error fetching beneficiary {beneficiary_id}: {e}")
            raise

class SupabaseScoreRepository:
    """Repository for score history operations using Supabase client."""
    
    def __init__(self):
        self.supabase = SupabaseManager()
    
    def save_score(self, beneficiary_id: str, score_data: Dict[str, Any], calculated_by: str) -> str:
        """Save a new credit score calculation."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            data = {
                'beneficiary_id': beneficiary_id,
                'credit_score': score_data.get('credit_score'),
                'risk_category': score_data.get('risk_category'),
                'confidence_level': score_data.get('confidence_level'),
                'model_version': score_data.get('model_version'),
                'feature_values': score_data.get('feature_values', {}),
                'feature_impacts': score_data.get('feature_impacts', {}),
                'explanation': score_data.get('explanation'),
                'improvement_suggestions': score_data.get('improvement_suggestions', []),
                'calculation_trigger': score_data.get('calculation_trigger', 'manual'),
                'calculated_by': calculated_by
            }
            
            result = self.supabase.client.table('score_history').insert(data).execute()
            
            if result.data:
                return result.data[0]['id']
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error saving score: {e}")
            raise
    
    def get_score_history(self, beneficiary_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get score history for a beneficiary."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            result = self.supabase.client.table('score_history').select('*').eq(
                'beneficiary_id', beneficiary_id
            ).order('calculated_at', desc=True).limit(limit).execute()
            
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching score history: {e}")
            raise

class SupabaseUserRepository:
    """Repository for user management operations using Supabase client."""
    
    def __init__(self):
        self.supabase = SupabaseManager()
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            result = self.supabase.client.table('users').select('*').eq('email', email).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error fetching user by email: {e}")
            raise
    
    def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user."""
        if not self.supabase.client:
            raise Exception("Supabase client not initialized")
        
        try:
            result = self.supabase.client.table('users').insert(user_data).execute()
            if result.data:
                return result.data[0]['id']
            else:
                return None
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise

# Global instances
supabase_manager = SupabaseManager()
supabase_beneficiary_repo = SupabaseBeneficiaryRepository()
supabase_score_repo = SupabaseScoreRepository()
supabase_user_repo = SupabaseUserRepository()