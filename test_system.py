"""
System Test Suite for Project Zenith Multi-User Platform
Tests all major endpoints and functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Base URL for testing
BASE_URL = "http://localhost:8000"

async def test_api_health():
    """Test the health endpoint."""
    print("🔍 Testing API Health...")
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BASE_URL}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Health Check: {data['status']}")
                    print(f"   Database: {data['database_status']}")
                    print(f"   Total Beneficiaries: {data['total_beneficiaries']}")
                    return True
                else:
                    print(f"❌ Health check failed: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

async def test_beneficiaries_endpoint():
    """Test the beneficiaries endpoint."""
    print("\n🔍 Testing Beneficiaries Endpoint...")
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BASE_URL}/beneficiaries") as response:
                if response.status == 200:
                    data = await response.json()
                    count = data.get('total', 0)
                    print(f"✅ Beneficiaries endpoint working: {count} beneficiaries found")
                    
                    # Show sample data if available
                    if data.get('beneficiaries') and len(data['beneficiaries']) > 0:
                        sample = data['beneficiaries'][0]
                        print(f"   Sample beneficiary: {sample.get('name', 'N/A')} (Score: {sample.get('credit_score', 'N/A')})")
                    
                    return True
                else:
                    print(f"❌ Beneficiaries endpoint failed: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Beneficiaries endpoint error: {e}")
            return False

async def test_user_endpoints():
    """Test user management endpoints."""
    print("\n🔍 Testing User Management Endpoints...")
    
    # Test creating a user
    test_user_data = {
        "clerk_user_id": "test_clerk_123",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            # Test user sync endpoint
            async with session.post(f"{BASE_URL}/users/sync-clerk", json=test_user_data) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ User sync working: {data.get('message', 'Success')}")
                    
                    # Test getting user by Clerk ID
                    async with session.get(f"{BASE_URL}/users/clerk/test_clerk_123") as get_response:
                        if get_response.status == 200:
                            user_data = await get_response.json()
                            user = user_data.get('user')
                            if user:
                                print(f"✅ User retrieval working: {user['first_name']} {user['last_name']} ({user['role']})")
                                return True
                            else:
                                print("❌ User data not found in response")
                                return False
                        else:
                            print(f"❌ User retrieval failed: {get_response.status}")
                            return False
                else:
                    print(f"❌ User sync failed: {response.status}")
                    text = await response.text()
                    print(f"   Response: {text}")
                    return False
        except Exception as e:
            print(f"❌ User endpoints error: {e}")
            return False

async def test_model_endpoints():
    """Test ML model endpoints."""
    print("\n🔍 Testing ML Model Endpoints...")
    
    # Test feature importance
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BASE_URL}/feature-importance") as response:
                if response.status == 200:
                    data = await response.json()
                    importance = data.get('feature_importance', {})
                    print(f"✅ Feature importance working: {len(importance)} features")
                    
                    # Show top 3 features
                    if importance:
                        top_features = list(importance.items())[:3]
                        print("   Top features:")
                        for feature, score in top_features:
                            print(f"     - {feature}: {score:.3f}")
                    
                    return True
                else:
                    print(f"❌ Feature importance failed: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Model endpoints error: {e}")
            return False

async def test_database_connectivity():
    """Test database connectivity indirectly."""
    print("\n🔍 Testing Database Connectivity...")
    
    # Test by trying to fetch data that requires database
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BASE_URL}/beneficiaries?limit=1") as response:
                if response.status == 200:
                    print("✅ Database connectivity working")
                    return True
                else:
                    print(f"❌ Database connectivity issue: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Database connectivity error: {e}")
            return False

async def run_comprehensive_test():
    """Run all tests and provide summary."""
    print("🚀 Starting Project Zenith System Tests")
    print("=" * 50)
    
    tests = [
        ("API Health", test_api_health),
        ("Database Connectivity", test_database_connectivity),
        ("Beneficiaries Endpoint", test_beneficiaries_endpoint),
        ("User Management", test_user_endpoints),
        ("ML Model Endpoints", test_model_endpoints),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = await test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All systems operational! Multi-user platform ready for production.")
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    print("Project Zenith - Multi-User Credit Scoring System")
    print("System Test Suite")
    print(f"Testing server at: {BASE_URL}")
    print(f"Test time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run the tests
    success = asyncio.run(run_comprehensive_test())
    
    if success:
        print("\n🚀 System is ready for user testing!")
        print("\nNext steps:")
        print("1. Start the frontend: npm start (in frontend directory)")
        print("2. Open browser to http://localhost:3000")
        print("3. Test user registration and role-based access")
        print("4. Verify dashboard functionality for each user type")
    else:
        print("\n🔧 Please fix the failing tests before proceeding.")