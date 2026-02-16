"""
Explainable AI Module for IncluScore
Provides natural language explanations for credit score predictions using SHAP
"""

import pandas as pd
import numpy as np
import joblib
import shap
import os
from typing import Dict, List, Tuple, Any
from model import ZenithScoreModel
import warnings
warnings.filterwarnings('ignore')

class ZenithExplainer:
    """Provides natural language explanations for Zenith credit scores."""
    
    def __init__(self):
        self.model = ZenithScoreModel()
        self.explainer = None
        self.background_data = None
        self.feature_names_map = {
            'loan_repayment_status': 'Loan Repayment History',
            'loan_tenure_months': 'Loan Tenure',
            'electricity_bill_paid_on_time': 'Utility Bill Payments',
            'mobile_recharge_frequency': 'Mobile Recharge Frequency',
            'is_high_need': 'Financial Need Level',
            'age': 'Age',
            'monthly_income': 'Monthly Income',
            'employment_type': 'Employment Type'
        }
        
    def initialize_explainer(self, data_path: str = "beneficiaries.csv") -> bool:
        """
        Initialize the SHAP explainer with background data.
        
        Args:
            data_path: Path to the training data CSV
            
        Returns:
            True if successfully initialized, False otherwise
        """
        try:
            # Load the trained model
            if not self.model.load_model():
                print("Model not found. Please train the model first.")
                return False
            
            # Load background data for SHAP
            if os.path.exists(data_path):
                df = pd.read_csv(data_path)
                X_background = df[self.model.feature_columns].iloc[:50]  # Use subset for efficiency
                self.background_data = self.model.scaler.transform(X_background)
                
                # Create SHAP explainer
                self.explainer = shap.LinearExplainer(
                    self.model.model, 
                    self.background_data,
                    feature_perturbation="correlation_dependent"
                )
                
                return True
            else:
                print(f"Background data file {data_path} not found.")
                return False
                
        except Exception as e:
            print(f"Error initializing explainer: {e}")
            return False
    
    def get_shap_values(self, data_instance: Dict[str, Any]) -> Tuple[np.ndarray, float]:
        """
        Calculate SHAP values for a given data instance.
        
        Args:
            data_instance: Dictionary containing beneficiary features
            
        Returns:
            Tuple of (SHAP values array, prediction probability)
        """
        if self.explainer is None:
            if not self.initialize_explainer():
                return None, 0.0
        
        try:
            # Prepare data
            X = pd.DataFrame([data_instance])[self.model.feature_columns]
            X_scaled = self.model.scaler.transform(X)
            
            # Calculate SHAP values
            shap_values = self.explainer.shap_values(X_scaled)
            
            # Get prediction probability
            prob = self.model.model.predict_proba(X_scaled)[0][1]
            
            return shap_values[0], prob
            
        except Exception as e:
            print(f"Error calculating SHAP values: {e}")
            return None, 0.0
    
    def generate_explanation(self, data_instance: Dict[str, Any]) -> str:
        """
        Generate natural language explanation for a beneficiary's credit score.
        
        Args:
            data_instance: Dictionary containing beneficiary features
            
        Returns:
            Natural language explanation string
        """
        shap_values, prob = self.get_shap_values(data_instance)
        
        if shap_values is None:
            return "Unable to generate explanation. Please ensure the model is properly trained."
        
        try:
            # Map SHAP values to feature names
            feature_impacts = {}
            for i, feature in enumerate(self.model.feature_columns):
                feature_impacts[feature] = shap_values[i]
            
            # Find most positive and negative impacts
            sorted_impacts = sorted(feature_impacts.items(), key=lambda x: abs(x[1]), reverse=True)
            
            # Get the most influential features
            most_positive = max(feature_impacts.items(), key=lambda x: x[1])
            most_negative = min(feature_impacts.items(), key=lambda x: x[1])
            
            # Generate explanation based on prediction confidence and SHAP values
            score = int(300 + (prob * 600))
            
            explanation_parts = []
            
            # Overall score assessment
            if score >= 750:
                explanation_parts.append("This beneficiary has an excellent credit score.")
            elif score >= 650:
                explanation_parts.append("This beneficiary has a good credit score.")
            elif score >= 550:
                explanation_parts.append("This beneficiary has a fair credit score.")
            else:
                explanation_parts.append("This beneficiary has a low credit score.")
            
            # Primary positive factor
            if most_positive[1] > 0.1:
                feature_name = self.feature_names_map.get(most_positive[0], most_positive[0])
                value = data_instance.get(most_positive[0], 0)
                
                if most_positive[0] == 'loan_repayment_status' and value == 1:
                    explanation_parts.append("The score is primarily driven by consistent loan repayment history.")
                elif most_positive[0] == 'electricity_bill_paid_on_time' and value == 1:
                    explanation_parts.append("Regular utility bill payments significantly boost the score.")
                elif most_positive[0] == 'mobile_recharge_frequency' and value >= 3:
                    explanation_parts.append("Frequent mobile recharges indicate financial stability.")
                elif most_positive[0] == 'employment_type' and value == 2:
                    explanation_parts.append("Salaried employment provides strong creditworthiness foundation.")
                elif most_positive[0] == 'monthly_income' and value >= 15000:
                    explanation_parts.append("Higher monthly income contributes positively to the score.")
                else:
                    explanation_parts.append(f"Strong {feature_name.lower()} contributes most to the positive score.")
            
            # Primary area for improvement
            if most_negative[1] < -0.05:
                feature_name = self.feature_names_map.get(most_negative[0], most_negative[0])
                value = data_instance.get(most_negative[0], 0)
                
                if most_negative[0] == 'loan_repayment_status' and value == 0:
                    explanation_parts.append("The main concern is the loan repayment history - improving this will significantly boost the score.")
                elif most_negative[0] == 'electricity_bill_paid_on_time' and value == 0:
                    explanation_parts.append("Paying utility bills on time would improve the creditworthiness significantly.")
                elif most_negative[0] == 'mobile_recharge_frequency' and value <= 2:
                    explanation_parts.append("More regular mobile recharges would indicate better financial stability.")
                elif most_negative[0] == 'employment_type' and value == 0:
                    explanation_parts.append("Securing stable employment would greatly improve the credit profile.")
                else:
                    explanation_parts.append(f"Improving {feature_name.lower()} would help increase the score.")
            
            # Specific recommendations based on current status
            recommendations = self._generate_recommendations(data_instance, feature_impacts)
            if recommendations:
                explanation_parts.extend(recommendations)
            
            return " ".join(explanation_parts)
            
        except Exception as e:
            print(f"Error generating explanation: {e}")
            return "Unable to generate detailed explanation at this time."
    
    def _generate_recommendations(self, data_instance: Dict[str, Any], feature_impacts: Dict[str, float]) -> List[str]:
        """
        Generate specific recommendations based on the beneficiary's profile.
        
        Args:
            data_instance: Beneficiary data
            feature_impacts: SHAP feature impacts
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # Check each feature and provide specific advice
        if data_instance.get('loan_repayment_status', 1) == 0:
            recommendations.append("Focus on making all future loan payments on time to rebuild credit history.")
        
        if data_instance.get('electricity_bill_paid_on_time', 1) == 0:
            recommendations.append("Set up automatic utility bill payments to demonstrate financial discipline.")
        
        if data_instance.get('mobile_recharge_frequency', 4) <= 2:
            recommendations.append("Consider more regular mobile recharges to show consistent spending patterns.")
        
        if data_instance.get('employment_type', 2) == 0:
            recommendations.append("Securing employment would significantly improve creditworthiness.")
        
        monthly_income = data_instance.get('monthly_income', 20000)
        if monthly_income < 10000:
            recommendations.append("Increasing income through skill development or additional work can boost the score.")
        
        return recommendations[:2]  # Return maximum 2 recommendations to keep explanation concise

# Utility functions for the API
def generate_explanation(data_instance: Dict[str, Any]) -> str:
    """Generate explanation for a beneficiary's credit score."""
    explainer = ZenithExplainer()
    return explainer.generate_explanation(data_instance)

def get_feature_impacts(data_instance: Dict[str, Any]) -> Dict[str, float]:
    """Get feature impacts for a beneficiary."""
    explainer = ZenithExplainer()
    shap_values, _ = explainer.get_shap_values(data_instance)
    
    if shap_values is None:
        return {}
    
    feature_impacts = {}
    for i, feature in enumerate(explainer.model.feature_columns):
        feature_impacts[feature] = float(shap_values[i])
    
    return feature_impacts

if __name__ == "__main__":
    # Test the explainer
    if os.path.exists("beneficiaries.csv"):
        sample_data = {
            'loan_repayment_status': 1,
            'loan_tenure_months': 12,
            'electricity_bill_paid_on_time': 0,  # This will be a negative factor
            'mobile_recharge_frequency': 4,
            'is_high_need': 1,
            'age': 28,
            'monthly_income': 18000,
            'employment_type': 2
        }
        
        print("Testing explanation generation...")
        explanation = generate_explanation(sample_data)
        print(f"\nExplanation: {explanation}")
        
        print("\nFeature impacts:")
        impacts = get_feature_impacts(sample_data)
        for feature, impact in sorted(impacts.items(), key=lambda x: abs(x[1]), reverse=True):
            print(f"{feature}: {impact:.3f}")
    else:
        print("No data file found. Please run data_generator.py first.")