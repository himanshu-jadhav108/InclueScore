"""
Test script for database connectivity and basic operations
"""

import asyncio
import sys
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv(".env.local")

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Debug environment loading
print("🔍 Environment Debug Info:")
print(f"Current directory: {os.getcwd()}")
print(f".env.local exists: {os.path.exists('.env.local')}")
print(f"SUPABASE_URL set: {'Yes' if os.getenv('SUPABASE_URL') else 'No'}")
print(f"SUPABASE_KEY set: {'Yes' if os.getenv('SUPABASE_KEY') else 'No'}")
print(f"SUPABASE_DB_PASSWORD set: {'Yes' if os.getenv('SUPABASE_DB_PASSWORD') else 'No'}")

if os.getenv('SUPABASE_URL'):
    print(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')[:50]}...")
    
print("\n" + "="*50 + "\n")

try:
    from database import db_manager, beneficiary_repo, user_repo
except Exception as e:
    print(f"❌ Failed to import database modules: {e}")
    print("\n🔧 Troubleshooting:")
    print("1. Check if .env.local file exists in the backend directory")
    print("2. Verify SUPABASE_URL and SUPABASE_KEY are set")
    print("3. Install required packages: pip install asyncpg python-dotenv")
    sys.exit(1)

async def test_database_connection():
    """Test basic database operations."""
    try:
        print("🔄 Testing database connection...")
        
        # Test basic connectivity
        await db_manager.initialize_pool()
        print("✅ Database connection successful!")
        
        # Test user repository
        print("\n🔄 Testing user operations...")
        users = await db_manager.execute_query("SELECT COUNT(*) as count FROM users")
        print(f"✅ Found {users[0]['count']} users in database")
        
        # Test beneficiary repository
        print("\n🔄 Testing beneficiary operations...")
        beneficiaries = await beneficiary_repo.get_all_beneficiaries()
        print(f"✅ Found {len(beneficiaries)} beneficiaries in database")
        
        # Display sample beneficiary data
        if beneficiaries:
            sample = beneficiaries[0]
            print(f"\n📋 Sample beneficiary:")
            print(f"   ID: {sample.get('id')}")
            print(f"   Code: {sample.get('beneficiary_code')}")
            print(f"   Name: {sample.get('first_name')} {sample.get('last_name')}")
            print(f"   Score: {sample.get('credit_score')}")
            print(f"   Risk: {sample.get('risk_category')}")
        
        print("\n🎉 All database tests passed!")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        print(f"Error type: {type(e).__name__}")
        
        # Common troubleshooting tips
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your SUPABASE_URL in .env.local")
        print("2. Ensure you have the correct database password")
        print("3. Verify Supabase project is active")
        print("4. Check if asyncpg is installed: pip install asyncpg")
        
    finally:
        await db_manager.close_pool()

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_database_connection())