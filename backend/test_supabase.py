"""
Test script for Supabase client connectivity
"""

import sys
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv(".env.local")

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Debug environment loading
print("🔍 Supabase Client Test:")
print(f"Current directory: {os.getcwd()}")
print(f".env.local exists: {os.path.exists('.env.local')}")
print(f"SUPABASE_URL set: {'Yes' if os.getenv('SUPABASE_URL') else 'No'}")
print(f"SUPABASE_KEY set: {'Yes' if os.getenv('SUPABASE_KEY') else 'No'}")

if os.getenv('SUPABASE_URL'):
    print(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')[:50]}...")
    
print("\n" + "="*50 + "\n")

try:
    from supabase_client import (
        supabase_manager, 
        supabase_beneficiary_repo, 
        supabase_user_repo
    )
except Exception as e:
    print(f"❌ Failed to import Supabase modules: {e}")
    print("\n🔧 Troubleshooting:")
    print("1. Install supabase client: pip install supabase")
    print("2. Check if .env.local file exists in the backend directory")
    print("3. Verify SUPABASE_URL and SUPABASE_KEY are set")
    sys.exit(1)

def test_supabase_connection():
    """Test Supabase REST API connectivity."""
    try:
        print("🔄 Testing Supabase connection...")
        
        # Test basic connectivity
        if not supabase_manager.client:
            print("❌ Supabase client not initialized")
            return False
        
        # Test connection with a simple query
        connection_ok = supabase_manager.test_connection()
        
        if connection_ok:
            print("✅ Supabase connection successful!")
        else:
            print("❌ Supabase connection test failed")
            return False
        
        # Test user operations
        print("\n🔄 Testing user operations...")
        try:
            users = supabase_manager.client.table('users').select('id, email, role').limit(5).execute()
            print(f"✅ Found {len(users.data)} users in database")
            
            if users.data:
                for user in users.data[:3]:  # Show first 3 users
                    print(f"   📋 User: {user.get('email')} (Role: {user.get('role')})")
        except Exception as e:
            print(f"❌ User query failed: {e}")
        
        # Test beneficiary operations
        print("\n🔄 Testing beneficiary operations...")
        try:
            beneficiaries = supabase_beneficiary_repo.get_all_beneficiaries()
            print(f"✅ Found {len(beneficiaries)} beneficiaries in database")
            
            if beneficiaries:
                sample = beneficiaries[0]
                print(f"\n📋 Sample beneficiary:")
                print(f"   ID: {sample.get('id')}")
                print(f"   Code: {sample.get('beneficiary_code')}")
                print(f"   Name: {sample.get('first_name')} {sample.get('last_name')}")
                print(f"   Email: {sample.get('email')}")
                print(f"   Score: {sample.get('credit_score')}")
                print(f"   Risk: {sample.get('risk_category')}")
                print(f"   Income: ₹{sample.get('monthly_income', 0):,}")
        except Exception as e:
            print(f"❌ Beneficiary query failed: {e}")
        
        print("\n🎉 All Supabase tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Supabase test failed: {e}")
        print(f"Error type: {type(e).__name__}")
        
        # Common troubleshooting tips
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your SUPABASE_URL in .env.local")
        print("2. Verify your SUPABASE_KEY (anon key) is correct")
        print("3. Ensure your Supabase project is active")
        print("4. Check if the database tables exist")
        print("5. Verify RLS policies allow read access")
        
        return False

if __name__ == "__main__":
    success = test_supabase_connection()
    if success:
        print("\n🚀 Supabase client is ready for use!")
        print("You can now start the FastAPI server with: python main.py")
    else:
        print("\n❌ Please fix the issues above before proceeding.")
    
    sys.exit(0 if success else 1)