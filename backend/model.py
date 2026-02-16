"""
Machine Learning Model for IncluScore
Implements dynamic credit scoring with online learning capabilities
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from typing import Dict, List, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

class ZenithScoreModel:
    """Dynamic credit scoring model with online learning capabilities."""
    
    _instance = None
    _model_loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.model = None
            self.scaler = None
            self.feature_columns = None
            self.model_path = "zenith_model.joblib"
            self.scaler_path = "zenith_scaler.joblib"
            self.columns_path = "feature_columns.joblib"
            self.initialized = True
        
    def train_initial_model(self, data_path: str = "beneficiaries.csv") -> Dict[str, Any]:
        """
        Train the initial SGD classifier model on the beneficiary data.
        
        Args:
            data_path: Path to the CSV file containing beneficiary data
            
        Returns:
            Dictionary containing training results and metrics
        """
        # Load data
        df = pd.read_csv(data_path)
        return self.train_initial_model_from_dataframe(df)
    
    def train_initial_model_from_dataframe(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Train the initial SGD classifier model from a pandas DataFrame.
        
        Args:
            df: DataFrame containing beneficiary data
            
        Returns:
            Dictionary containing training results and metrics
        """
        
        # Prepare features (exclude target and id)
        feature_columns = [col for col in df.columns if col not in ['beneficiary_id', 'creditworthy']]
        self.feature_columns = feature_columns
        
        X = df[feature_columns]
        y = df['creditworthy']
        
        # Split data for training and validation
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Initialize and train SGD classifier with online learning capability
        self.model = SGDClassifier(
            loss='log_loss',  # For probability predictions
            learning_rate='constant',
            eta0=0.01,
            random_state=42,
            max_iter=1000,
            alpha=0.0001
        )
        
        # Train the model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Save the model, scaler, and feature columns
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        joblib.dump(self.feature_columns, self.columns_path)
        
        # Mark as loaded in singleton
        ZenithScoreModel._model_loaded = True
        
        print(f"Initial model trained with accuracy: {accuracy:.3f}")
        print(f"Model saved to {self.model_path}")
        
        return {
            "accuracy": accuracy,
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "feature_count": len(feature_columns)
        }
    
    def load_model(self) -> bool:
        """
        Load the trained model, scaler, and feature columns.
        Uses singleton pattern to avoid repeated loading.
        
        Returns:
            True if successfully loaded, False otherwise
        """
        # Return immediately if already loaded
        if ZenithScoreModel._model_loaded and self.model is not None:
            return True
            
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.feature_columns = joblib.load(self.columns_path)
                ZenithScoreModel._model_loaded = True
                return True
            return False
        except Exception as e:
            print(f"Error loading model: {e}")
            ZenithScoreModel._model_loaded = False
            return False
    
    def update_model(self, new_data_instance: Dict[str, Any]) -> Dict[str, str]:
        """
        Update the model with a new data instance using online learning.
        
        Args:
            new_data_instance: Dictionary containing the new data point
            
        Returns:
            Status dictionary
        """
        if not self.load_model():
            return {"status": "error", "message": "Model not found. Please train initial model first."}
        
        try:
            # Prepare the new data point
            X_new = pd.DataFrame([new_data_instance])[self.feature_columns]
            X_new_scaled = self.scaler.transform(X_new)
            
            # Extract target if provided
            y_new = [new_data_instance.get('creditworthy', 1)]  # Default to 1 if not provided
            
            # Update model using partial_fit
            self.model.partial_fit(X_new_scaled, y_new)
            
            # Save updated model
            joblib.dump(self.model, self.model_path)
            
            # Keep singleton marked as loaded
            ZenithScoreModel._model_loaded = True
            
            return {"status": "success", "message": "Model updated successfully"}
            
        except Exception as e:
            return {"status": "error", "message": f"Failed to update model: {str(e)}"}
    
    def validate_data(self, data: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Validate input data against expected features.
        
        Args:
            data: Dictionary containing beneficiary features
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not self.load_model():
            return False, "Model not available for validation"
        
        # Check if all required features are present
        missing_features = [f for f in self.feature_columns if f not in data]
        if missing_features:
            return False, f"Missing required features: {missing_features}"
        
        # Validate data types and ranges
        try:
            # Validate loan_repayment_status (0 or 1)
            if 'loan_repayment_status' in data:
                if data['loan_repayment_status'] not in [0, 1]:
                    return False, "loan_repayment_status must be 0 or 1"
            
            # Validate electricity_bill_paid_on_time (0 or 1)
            if 'electricity_bill_paid_on_time' in data:
                if data['electricity_bill_paid_on_time'] not in [0, 1]:
                    return False, "electricity_bill_paid_on_time must be 0 or 1"
            
            # Validate mobile_recharge_frequency (1-4)
            if 'mobile_recharge_frequency' in data:
                if not (1 <= data['mobile_recharge_frequency'] <= 4):
                    return False, "mobile_recharge_frequency must be between 1 and 4"
            
            # Validate employment_type (0, 1, or 2)
            if 'employment_type' in data:
                if data['employment_type'] not in [0, 1, 2]:
                    return False, "employment_type must be 0, 1, or 2"
            
            # Validate age (18-65)
            if 'age' in data:
                if not (18 <= data['age'] <= 65):
                    return False, "age must be between 18 and 65"
            
            # Validate monthly_income (positive number)
            if 'monthly_income' in data:
                if data['monthly_income'] < 0:
                    return False, "monthly_income must be positive"
            
            # Validate is_high_need (0 or 1)
            if 'is_high_need' in data:
                if data['is_high_need'] not in [0, 1]:
                    return False, "is_high_need must be 0 or 1"
            
            return True, "Data validation passed"
            
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    def predict_score(self, data: Dict[str, Any]) -> int:
        """
        Predict the Zenith score (300-900 scale) for a beneficiary.
        
        Args:
            data: Dictionary containing beneficiary features
            
        Returns:
            Zenith score between 300 and 900
        """
        if not self.load_model():
            return 500  # Default score if model not available
        
        # Validate input data
        is_valid, error_msg = self.validate_data(data)
        if not is_valid:
            print(f"Data validation failed: {error_msg}")
            return 500  # Return default score for invalid data
        
        try:
            # Prepare data
            X = pd.DataFrame([data])[self.feature_columns]
            X_scaled = self.scaler.transform(X)
            
            # Get probability of being creditworthy
            prob = self.model.predict_proba(X_scaled)[0][1]
            
            # Convert to 300-900 scale
            score = int(300 + (prob * 600))
            return min(900, max(300, score))
            
        except Exception as e:
            print(f"Error predicting score: {e}")
            return 500
    
    def predict_risk_need(self, data: Dict[str, Any]) -> str:
        """
        Predict the risk and need category for a beneficiary.
        
        Args:
            data: Dictionary containing beneficiary features
            
        Returns:
            Risk-Need category string
        """
        score = self.predict_score(data)
        is_high_need = data.get('is_high_need', 0)
        
        # Determine risk level based on score
        if score >= 700:
            risk_level = "Low Risk"
        elif score >= 550:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
        
        # Determine need level
        need_level = "High Need" if is_high_need == 1 else "Low Need"
        
        return f"{risk_level} - {need_level}"
    
    def get_feature_importance(self) -> Dict[str, float]:
        """
        Get feature importance from the trained model.
        
        Returns:
            Dictionary mapping feature names to importance scores
        """
        if not self.load_model():
            return {}
        
        try:
            # For SGD classifier, use coefficients as feature importance
            importance = abs(self.model.coef_[0])
            return dict(zip(self.feature_columns, importance))
        except Exception as e:
            print(f"Error getting feature importance: {e}")
            return {}

# Utility functions for the API
def train_initial_model(data_path: str = "beneficiaries.csv") -> Dict[str, Any]:
    """Train the initial model and return training results."""
    model = ZenithScoreModel()
    return model.train_initial_model(data_path)

def predict_score(data: Dict[str, Any]) -> int:
    """Predict Zenith score for given data."""
    model = ZenithScoreModel()
    return model.predict_score(data)

def predict_risk_need(data: Dict[str, Any]) -> str:
    """Predict risk-need category for given data."""
    model = ZenithScoreModel()
    return model.predict_risk_need(data)

def update_model(new_data_instance: Dict[str, Any]) -> Dict[str, str]:
    """Update model with new data instance."""
    model = ZenithScoreModel()
    return model.update_model(new_data_instance)

def get_feature_importance() -> Dict[str, float]:
    """Get feature importance from the model."""
    model = ZenithScoreModel()
    return model.get_feature_importance()

if __name__ == "__main__":
    # Train initial model if data exists
    if os.path.exists("beneficiaries.csv"):
        print("Training initial model...")
        results = train_initial_model()
        print(f"Training completed: {results}")
        
        # Test prediction
        sample_data = {
            'loan_repayment_status': 1,
            'loan_tenure_months': 12,
            'electricity_bill_paid_on_time': 1,
            'mobile_recharge_frequency': 3,
            'is_high_need': 1,
            'age': 30,
            'monthly_income': 15000,
            'employment_type': 2
        }
        
        score = predict_score(sample_data)
        category = predict_risk_need(sample_data)
        
        print(f"\nSample prediction:")
        print(f"Score: {score}")
        print(f"Category: {category}")
        
    else:
        print("No data file found. Please run data_generator.py first.")