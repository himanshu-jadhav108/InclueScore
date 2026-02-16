
"""
Project Zenith Demo Script
Demonstrates all key features of the dynamic credit scoring system
"""

import requests
import json
import time
from tabulate import tabulate

# API base URL
BASE_URL = "http://localhost:8000"

def print_header(title):
    """Print a formatted header."""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def print_json(data, title=""):
    """Pretty print JSON data."""
    if title:
        print(f"\n{title}:")
    print(json.dumps(data, indent=2))

def demo_api_health():
    """Check API health status."""
    print_header("🏥 API HEALTH CHECK")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            health_data = response.json()
            print("✅ API is healthy!")
            print_json(health_data)
        else:
            print("❌ API health check failed")
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        print("Make sure the backend server is running on http://localhost:8000")
        return False
    
    return True

def demo_beneficiary_profile():
    """Demonstrate beneficiary profile retrieval."""
    print_header("👤 BENEFICIARY PROFILE")
    
    try:
        # Get beneficiary data
        beneficiary_id = 1
        response = requests.get(f"{BASE_URL}/beneficiary/{beneficiary_id}")
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"📋 Beneficiary #{data['id']} Profile:")
            print(f"   Score: {data['score']}")
            print(f"   Risk Category: {data['risk_category']}")
            
            print(f"\n📊 Profile Details:")
            profile_data = data['data']
            table_data = []
            for key, value in profile_data.items():
                table_data.append([key.replace('_', ' ').title(), value])
            
            print(tabulate(table_data, headers=['Attribute', 'Value'], tablefmt='grid'))
            
            print(f"\n🤖 AI Explanation:")
            print(f"   {data['explanation']}")
            
        else:
            print(f"❌ Failed to get beneficiary data: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_score_simulation():
    """Demonstrate the killer feature - score simulation."""
    print_header("🚀 SCORE SIMULATION - KILLER FEATURE!")
    
    try:
        # Current beneficiary data
        current_data = {
            "loan_repayment_status": 0,  # Poor repayment
            "loan_tenure_months": 12,
            "electricity_bill_paid_on_time": 0,  # Poor utility payments
            "mobile_recharge_frequency": 2,
            "is_high_need": 1,
            "age": 28,
            "monthly_income": 12000,
            "employment_type": 1  # Self-employed
        }
        
        # Hypothetical improvements
        hypothetical_changes = {
            "loan_repayment_status": 1,  # Improve to on-time payments
            "electricity_bill_paid_on_time": 1,  # Improve utility payments
            "mobile_recharge_frequency": 4,  # Increase recharge frequency
            "employment_type": 2  # Get salaried job
        }
        
        simulation_request = {
            "current_data": current_data,
            "hypothetical_changes": hypothetical_changes
        }
        
        print("📈 Simulating score improvements...")
        print(f"Current Situation:")
        print(f"  - Loan Repayment: Poor")
        print(f"  - Utility Bills: Late payments")
        print(f"  - Mobile Recharges: 2/month")
        print(f"  - Employment: Self-employed")
        
        print(f"\nProposed Improvements:")
        print(f"  - Loan Repayment: On-time payments ✅")
        print(f"  - Utility Bills: On-time payments ✅")
        print(f"  - Mobile Recharges: 4/month ✅")
        print(f"  - Employment: Salaried job ✅")
        
        response = requests.post(f"{BASE_URL}/simulate", json=simulation_request)
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n🎯 SIMULATION RESULTS:")
            print(f"   Current Score:   {result['current_score']}")
            print(f"   Projected Score: {result['projected_score']}")
            print(f"   Score Increase:  +{result['score_change']} points")
            
            if result['score_change'] > 0:
                print(f"   🎉 Great improvement potential!")
            
            print(f"\n🤖 AI Analysis:")
            print(f"   {result['explanation']}")
            
        else:
            print(f"❌ Simulation failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_online_learning():
    """Demonstrate online learning capability."""
    print_header("🧠 ONLINE LEARNING DEMONSTRATION")
    
    try:
        # New data point for model update
        new_data = {
            "beneficiary_id": 101,
            "new_data": {
                "loan_repayment_status": 1,
                "loan_tenure_months": 18,
                "electricity_bill_paid_on_time": 1,
                "mobile_recharge_frequency": 4,
                "is_high_need": 1,
                "age": 35,
                "monthly_income": 20000,
                "employment_type": 2,
                "creditworthy": 1  # Target label
            }
        }
        
        print("📚 Updating model with new data point...")
        print("This demonstrates the online learning capability:")
        print_json(new_data['new_data'], "New Training Data")
        
        response = requests.post(f"{BASE_URL}/update", json=new_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ Model Update Result:")
            print_json(result)
            
            print(f"\n🎯 Key Benefits of Online Learning:")
            print(f"   - Model improves continuously")
            print(f"   - No need for complete retraining")
            print(f"   - Adapts to new patterns in real-time")
            print(f"   - Scalable for production use")
            
        else:
            print(f"❌ Model update failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_feature_importance():
    """Demonstrate feature importance analysis."""
    print_header("📊 FEATURE IMPORTANCE ANALYSIS")
    
    try:
        response = requests.get(f"{BASE_URL}/feature-importance")
        
        if response.status_code == 200:
            data = response.json()
            importance = data['feature_importance']
            
            print("🔍 Model Feature Importance (what matters most):")
            
            # Sort by importance and create table
            sorted_features = sorted(importance.items(), key=lambda x: x[1], reverse=True)
            table_data = []
            
            for feature, score in sorted_features:
                feature_name = feature.replace('_', ' ').title()
                importance_level = "High" if score > 0.3 else "Medium" if score > 0.1 else "Low"
                table_data.append([feature_name, f"{score:.4f}", importance_level])
            
            print(tabulate(table_data, 
                         headers=['Feature', 'Importance Score', 'Level'], 
                         tablefmt='grid'))
            
            print(f"\n💡 Insights:")
            top_feature = sorted_features[0]
            print(f"   - Most important factor: {top_feature[0].replace('_', ' ').title()}")
            print(f"   - Focus on improving top features for maximum impact")
            
        else:
            print(f"❌ Failed to get feature importance: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_all_beneficiaries():
    """Show overview of all beneficiaries."""
    print_header("📋 ALL BENEFICIARIES OVERVIEW")
    
    try:
        response = requests.get(f"{BASE_URL}/beneficiaries")
        
        if response.status_code == 200:
            data = response.json()
            beneficiaries = data['beneficiaries']
            
            print(f"👥 Total Beneficiaries: {data['total_beneficiaries']}")
            
            # Create summary table
            table_data = []
            high_need_eligible = 0
            
            for b in beneficiaries[:10]:  # Show first 10
                eligible = "✅" if b['risk_category'] == 'Low Risk - High Need' else "❌"
                if b['risk_category'] == 'Low Risk - High Need':
                    high_need_eligible += 1
                
                table_data.append([
                    f"#{b['id']}", 
                    b['score'], 
                    b['risk_category'],
                    "Yes" if b['is_high_need'] else "No",
                    eligible
                ])
            
            print(tabulate(table_data, 
                         headers=['ID', 'Score', 'Risk Category', 'High Need', 'Insta-Loan'], 
                         tablefmt='grid'))
            
            print(f"\n📈 Statistics:")
            print(f"   - Insta-Loan Eligible: {high_need_eligible} beneficiaries")
            print(f"   - Average Score: {sum(b['score'] for b in beneficiaries) / len(beneficiaries):.0f}")
            
        else:
            print(f"❌ Failed to get beneficiaries: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Run the complete demonstration."""
    print("🏆 PROJECT ZENITH - DYNAMIC CREDIT SCORING SYSTEM")
    print("   Award-Winning Hackathon Project Demonstration")
    
    # Check API health first
    if not demo_api_health():
        print("\n❌ Cannot proceed with demo. Please start the backend server first.")
        return
    
    # Run all demonstrations
    demo_beneficiary_profile()
    time.sleep(1)
    
    demo_score_simulation()
    time.sleep(1)
    
    demo_online_learning()
    time.sleep(1)
    
    demo_feature_importance()
    time.sleep(1)
    
    demo_all_beneficiaries()
    
    print_header("🎉 DEMONSTRATION COMPLETE!")
    print("Key Features Demonstrated:")
    print("✅ Real-time credit scoring")
    print("✅ Interactive score simulation (KILLER FEATURE)")
    print("✅ Online learning with model updates")
    print("✅ Explainable AI with natural language")
    print("✅ Feature importance analysis")
    print("✅ Risk-need categorization")
    print("✅ Insta-loan eligibility")
    
    print(f"\n🌐 Access the web interface at: http://localhost:3000")
    print(f"📚 API documentation at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()