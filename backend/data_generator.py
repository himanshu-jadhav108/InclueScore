"""
Data Generator for IncluScore
Generates realistic beneficiary data for credit scoring model training
"""

import pandas as pd
import numpy as np
import random
from typing import Dict, List

def generate_beneficiary_data(num_beneficiaries: int = 100) -> pd.DataFrame:
    """
    Generate realistic beneficiary data for training the credit scoring model.
    
    Args:
        num_beneficiaries: Number of beneficiaries to generate
        
    Returns:
        DataFrame with beneficiary data and target variable
    """
    np.random.seed(42)  # For reproducible results
    random.seed(42)
    
    data = []
    
    for i in range(1, num_beneficiaries + 1):
        # Generate base features
        loan_repayment_status = np.random.choice([0, 1], p=[0.25, 0.75])  # 75% good repayment
        loan_tenure_months = np.random.randint(6, 25)  # 6-24 months
        electricity_bill_paid_on_time = np.random.choice([0, 1], p=[0.3, 0.7])  # 70% on time
        mobile_recharge_frequency = np.random.randint(1, 5)  # 1-4 times per month
        is_high_need = np.random.choice([0, 1], p=[0.6, 0.4])  # 40% high need
        
        # Generate additional realistic features for better model performance
        age = np.random.randint(18, 65)
        monthly_income = np.random.choice([5000, 8000, 12000, 15000, 20000, 25000])
        employment_type = np.random.choice([0, 1, 2])  # 0: Unemployed, 1: Self-employed, 2: Salaried
        
        # Create logical target variable based on features
        # Higher probability of being creditworthy if:
        # - Good loan repayment history
        # - Pays electricity bills on time
        # - Regular mobile recharges
        # - Stable income and employment
        
        creditworthy_score = 0
        
        # Loan repayment is the strongest indicator
        if loan_repayment_status == 1:
            creditworthy_score += 3
            
        # Utility bill payments show financial discipline
        if electricity_bill_paid_on_time == 1:
            creditworthy_score += 2
            
        # Regular mobile recharges indicate stable income
        if mobile_recharge_frequency >= 3:
            creditworthy_score += 1
            
        # Employment and income factors
        if employment_type == 2:  # Salaried
            creditworthy_score += 2
        elif employment_type == 1:  # Self-employed
            creditworthy_score += 1
            
        if monthly_income >= 15000:
            creditworthy_score += 1
            
        # Age factor (middle-aged people tend to be more stable)
        if 25 <= age <= 50:
            creditworthy_score += 1
            
        # Convert score to binary with some randomness
        creditworthy_probability = min(0.9, creditworthy_score / 10.0 + 0.1)
        creditworthy = np.random.choice([0, 1], p=[1-creditworthy_probability, creditworthy_probability])
        
        beneficiary = {
            'beneficiary_id': i,
            'loan_repayment_status': loan_repayment_status,
            'loan_tenure_months': loan_tenure_months,
            'electricity_bill_paid_on_time': electricity_bill_paid_on_time,
            'mobile_recharge_frequency': mobile_recharge_frequency,
            'is_high_need': is_high_need,
            'age': age,
            'monthly_income': monthly_income,
            'employment_type': employment_type,
            'creditworthy': creditworthy
        }
        
        data.append(beneficiary)
    
    df = pd.DataFrame(data)
    return df

def save_beneficiary_data(df: pd.DataFrame, filepath: str = "beneficiaries.csv") -> None:
    """Save beneficiary data to CSV file."""
    df.to_csv(filepath, index=False)
    print(f"Generated data for {len(df)} beneficiaries and saved to {filepath}")
    
    # Print some statistics
    print(f"\nData Statistics:")
    print(f"Creditworthy beneficiaries: {df['creditworthy'].sum()} ({df['creditworthy'].mean():.2%})")
    print(f"Good loan repayment: {df['loan_repayment_status'].sum()} ({df['loan_repayment_status'].mean():.2%})")
    print(f"On-time electricity bills: {df['electricity_bill_paid_on_time'].sum()} ({df['electricity_bill_paid_on_time'].mean():.2%})")
    print(f"High need beneficiaries: {df['is_high_need'].sum()} ({df['is_high_need'].mean():.2%})")

if __name__ == "__main__":
    # Generate and save the data
    beneficiary_df = generate_beneficiary_data(100)
    save_beneficiary_data(beneficiary_df, "beneficiaries.csv")
    
    # Display sample data
    print(f"\nSample data:")
    print(beneficiary_df.head(10))