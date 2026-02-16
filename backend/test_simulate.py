"""
Test script to verify the simulate endpoint is working
"""
import requests
import json

# Test data
test_data = {
    "current_data": {
        "monthly_income": 15000,
        "employment_type": 1,
        "loan_repayment_status": 1,
        "electricity_bill_paid_on_time": 1,
        "mobile_recharge_frequency": 3,
        "loan_tenure_months": 12,
        "is_high_need": 1,
        "age": 30
    },
    "hypothetical_changes": {
        "monthly_income": 20000
    }
}

try:
    print("Testing simulate endpoint...")
    response = requests.post(
        "http://localhost:8000/simulate",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ Simulate endpoint is working!")
        print(f"\nCurrent Score: {result.get('current_score')}")
        print(f"Projected Score: {result.get('projected_score')}")
        print(f"Score Change: {result.get('score_change')}")
        print(f"\nExplanation: {result.get('explanation')}")
    else:
        print(f"\n❌ Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("\n❌ Cannot connect to backend server at http://localhost:8000")
    print("Please make sure the backend server is running.")
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
