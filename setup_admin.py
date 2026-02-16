"""
Quick Admin Setup Script for Project Zenith
This script helps you manually assign admin role to a user
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def list_users():
    """List all users in the system"""
    try:
        # First get all beneficiaries to see users
        response = requests.get(f"{BASE_URL}/beneficiaries")
        if response.status_code == 200:
            data = response.json()
            print("📋 Current users in system:")
            print("-" * 50)
            if data.get('beneficiaries'):
                for i, user in enumerate(data['beneficiaries'], 1):
                    print(f"{i}. Name: {user.get('name', 'N/A')}")
                    print(f"   Email: {user.get('email', 'N/A')}")
                    print(f"   ID: {user.get('id', 'N/A')}")
                    print()
            else:
                print("No users found.")
        else:
            print(f"Error fetching users: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

def make_user_admin():
    """Help make a user admin"""
    print("🔧 Admin Role Assignment")
    print("=" * 30)
    
    email = input("Enter the email address to make admin: ").strip()
    
    if not email:
        print("❌ Email is required")
        return
    
    # First, sync/create the user
    try:
        sync_data = {
            "clerk_user_id": f"admin_{email.replace('@', '_').replace('.', '_')}",
            "email": email,
            "first_name": "Admin",
            "last_name": "User"
        }
        
        print(f"🔄 Creating/syncing user: {email}")
        response = requests.post(f"{BASE_URL}/users/sync-clerk", json=sync_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User synced: {data.get('message', 'Success')}")
            
            # Get the user ID
            clerk_id = sync_data['clerk_user_id']
            user_response = requests.get(f"{BASE_URL}/users/clerk/{clerk_id}")
            
            if user_response.status_code == 200:
                user_data = user_response.json()
                user_id = user_data['user']['id']
                
                # Update role to admin
                role_response = requests.put(
                    f"{BASE_URL}/users/{user_id}/role",
                    json={"role": "admin"}
                )
                
                if role_response.status_code == 200:
                    print(f"🎉 SUCCESS! {email} is now an admin!")
                    print("📝 Next steps:")
                    print("   1. Sign out from Clerk (if logged in)")
                    print("   2. Sign in with this email address")
                    print("   3. You'll be redirected to admin dashboard")
                    return True
                else:
                    print(f"❌ Failed to update role: {role_response.status_code}")
                    print(f"Response: {role_response.text}")
            else:
                print(f"❌ Failed to get user: {user_response.status_code}")
        else:
            print(f"❌ Failed to sync user: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return False

def create_test_roles():
    """Create users with different roles for testing"""
    test_users = [
        {"email": "admin@test.com", "role": "admin", "first_name": "Admin", "last_name": "User"},
        {"email": "officer@test.com", "role": "loan_officer", "first_name": "Loan", "last_name": "Officer"},
        {"email": "manager@test.com", "role": "bank_manager", "first_name": "Bank", "last_name": "Manager"},
    ]
    
    print("🔧 Creating test users with different roles...")
    print("=" * 50)
    
    for user in test_users:
        try:
            # Sync user
            sync_data = {
                "clerk_user_id": f"test_{user['email'].replace('@', '_').replace('.', '_')}",
                "email": user['email'],
                "first_name": user['first_name'],
                "last_name": user['last_name']
            }
            
            print(f"Creating {user['role']}: {user['email']}")
            
            # Create user
            response = requests.post(f"{BASE_URL}/users/sync-clerk", json=sync_data)
            if response.status_code == 200:
                # Get user and update role
                clerk_id = sync_data['clerk_user_id']
                user_response = requests.get(f"{BASE_URL}/users/clerk/{clerk_id}")
                
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    user_id = user_data['user']['id']
                    
                    # Update role
                    role_response = requests.put(
                        f"{BASE_URL}/users/{user_id}/role",
                        json={"role": user['role']}
                    )
                    
                    if role_response.status_code == 200:
                        print(f"✅ Created {user['role']}: {user['email']}")
                    else:
                        print(f"❌ Failed to set role for {user['email']}")
                else:
                    print(f"❌ Failed to get user {user['email']}")
            else:
                print(f"❌ Failed to create user {user['email']}")
                
        except Exception as e:
            print(f"❌ Error creating {user['email']}: {e}")

def main():
    print("🚀 Project Zenith - Admin Setup Tool")
    print("=" * 40)
    
    while True:
        print("\nChoose an option:")
        print("1. List current users")
        print("2. Make a user admin")
        print("3. Create test users (admin, loan_officer, bank_manager)")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            list_users()
        elif choice == "2":
            if make_user_admin():
                print("\n🎉 Admin user created successfully!")
                print("Now you can test the full multi-user system!")
                break
        elif choice == "3":
            create_test_roles()
            print("\n✅ Test users created!")
            print("You can now test different roles:")
            print("   - admin@test.com (Admin Dashboard)")
            print("   - officer@test.com (Loan Officer Dashboard)")  
            print("   - manager@test.com (Bank Manager Dashboard)")
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()