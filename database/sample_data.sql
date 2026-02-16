-- Sample Data for Project Zenith
-- Run this after schema.sql to populate with test data

-- Clear existing sample data if it exists
DELETE FROM audit_logs WHERE user_email LIKE '%@zenith.local' OR user_email LIKE '%@rdb.local';
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local');
DELETE FROM workflow_history WHERE application_id IN (SELECT id FROM loan_applications WHERE beneficiary_id IN (SELECT id FROM beneficiaries WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local')));
DELETE FROM score_history WHERE beneficiary_id IN (SELECT id FROM beneficiaries WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local'));
DELETE FROM external_data_sources WHERE beneficiary_id IN (SELECT id FROM beneficiaries WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local'));
DELETE FROM loan_applications WHERE beneficiary_id IN (SELECT id FROM beneficiaries WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local'));
DELETE FROM beneficiaries WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local');
DELETE FROM users WHERE email LIKE '%zenith.local' OR email LIKE '%rdb.local';
DELETE FROM system_settings WHERE tenant_id IN (SELECT id FROM tenants WHERE domain LIKE '%zenith.local' OR domain LIKE '%rdb.local');
DELETE FROM tenants WHERE domain LIKE '%zenith.local' OR domain LIKE '%rdb.local';

-- Insert sample tenants
INSERT INTO tenants (id, name, domain, settings) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Zenith Financial Services', 'zenith.local', '{"max_loan_amount": 500000, "default_interest_rate": 12.5}'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Rural Development Bank', 'rdb.local', '{"max_loan_amount": 200000, "default_interest_rate": 10.0}')
ON CONFLICT (domain) DO UPDATE SET 
    name = EXCLUDED.name,
    settings = EXCLUDED.settings,
    updated_at = CURRENT_TIMESTAMP;

-- Insert sample users with different roles
INSERT INTO users (id, clerk_user_id, email, first_name, last_name, role, phone, tenant_id) VALUES 
    -- Admin user
    ('550e8400-e29b-41d4-a716-446655440010', 'clerk_admin_001', 'admin@zenith.local', 'System', 'Administrator', 'admin', '+91-9876543210', '550e8400-e29b-41d4-a716-446655440001'),
    
    -- Loan officers
    ('550e8400-e29b-41d4-a716-446655440011', 'clerk_officer_001', 'officer1@zenith.local', 'Rajesh', 'Kumar', 'loan_officer', '+91-9876543211', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440012', 'clerk_officer_002', 'officer2@zenith.local', 'Priya', 'Sharma', 'loan_officer', '+91-9876543212', '550e8400-e29b-41d4-a716-446655440001'),
    
    -- Bank manager
    ('550e8400-e29b-41d4-a716-446655440013', 'clerk_manager_001', 'manager@zenith.local', 'Suresh', 'Patel', 'bank_manager', '+91-9876543213', '550e8400-e29b-41d4-a716-446655440001'),
    
    -- Beneficiaries
    ('550e8400-e29b-41d4-a716-446655440020', 'clerk_ben_001', 'ravi.kumar@email.com', 'Ravi', 'Kumar', 'beneficiary', '+91-9876543220', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440021', 'clerk_ben_002', 'anita.singh@email.com', 'Anita', 'Singh', 'beneficiary', '+91-9876543221', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440022', 'clerk_ben_003', 'mahesh.yadav@email.com', 'Mahesh', 'Yadav', 'beneficiary', '+91-9876543222', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample beneficiaries with realistic data
INSERT INTO beneficiaries (
    id, user_id, beneficiary_code, date_of_birth, gender, marital_status, education_level,
    address, monthly_income, employment_type, employer_name, bank_account_number, bank_name, ifsc_code,
    loan_repayment_status, loan_tenure_months, electricity_bill_paid_on_time, mobile_recharge_frequency,
    savings_account_balance, has_fixed_deposits, is_high_need, kyc_status, verification_status, created_by
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440030',
        '550e8400-e29b-41d4-a716-446655440020',
        'ZEN001',
        '1985-06-15',
        'Male',
        'Married',
        'Graduate',
        '{"street": "123 MG Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001"}',
        25000.00,
        'salaried',
        'Tech Solutions Pvt Ltd',
        '1234567890123456',
        'State Bank of India',
        'SBIN0001234',
        1, -- Good repayment
        18,
        1, -- Pays bills on time
        4, -- Regular recharges
        15000.00,
        true,
        false, -- Not high need
        'verified',
        'approved',
        '550e8400-e29b-41d4-a716-446655440011'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440031',
        '550e8400-e29b-41d4-a716-446655440021',
        'ZEN002',
        '1990-03-22',
        'Female',
        'Single',
        'Post Graduate',
        '{"street": "456 Brigade Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560025"}',
        18000.00,
        'self_employed',
        'Fashion Boutique',
        '2345678901234567',
        'HDFC Bank',
        'HDFC0001234',
        1, -- Good repayment
        12,
        1, -- Pays bills on time
        3,
        8000.00,
        false,
        true, -- High need
        'verified',
        'approved',
        '550e8400-e29b-41d4-a716-446655440011'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440032',
        '550e8400-e29b-41d4-a716-446655440022',
        'ZEN003',
        '1988-11-08',
        'Male',
        'Married',
        'High School',
        '{"street": "789 Whitefield", "city": "Bangalore", "state": "Karnataka", "pincode": "560066"}',
        12000.00,
        'salaried',
        'Local Manufacturing Co',
        '3456789012345678',
        'Canara Bank',
        'CNRB0001234',
        0, -- Poor repayment history
        6,
        0, -- Irregular bill payments
        2,
        2000.00,
        false,
        true, -- High need
        'pending',
        'under_review',
        '550e8400-e29b-41d4-a716-446655440012'
    );

-- Insert sample loan applications
INSERT INTO loan_applications (
    id, application_number, beneficiary_id, loan_amount, loan_purpose, tenure_months,
    interest_rate, status, workflow_stage, priority_level, application_data, created_by
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440040',
        'APP001-2024',
        '550e8400-e29b-41d4-a716-446655440030',
        50000.00,
        'Business expansion',
        24,
        12.5,
        'approved',
        'disbursement',
        2,
        '{"business_type": "retail", "existing_business_years": 3, "monthly_revenue": 80000}',
        '550e8400-e29b-41d4-a716-446655440011'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440041',
        'APP002-2024',
        '550e8400-e29b-41d4-a716-446655440031',
        30000.00,
        'Equipment purchase',
        18,
        11.0,
        'under_review',
        'risk_assessment',
        3,
        '{"equipment_type": "sewing_machines", "business_plan": "tailoring_services"}',
        '550e8400-e29b-41d4-a716-446655440012'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440042',
        'APP003-2024',
        '550e8400-e29b-41d4-a716-446655440032',
        75000.00,
        'Home renovation',
        36,
        13.5,
        'submitted',
        'verification',
        1,
        '{"renovation_type": "kitchen_bathroom", "property_value": 500000}',
        '550e8400-e29b-41d4-a716-446655440011'
    );

-- Insert sample score history
INSERT INTO score_history (
    id, beneficiary_id, credit_score, risk_category, confidence_level, model_version,
    feature_values, feature_impacts, explanation, improvement_suggestions, calculation_trigger, calculated_by
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440030',
        720,
        'low_risk_low_need',
        92.5,
        'v1.2.0',
        '{"loan_repayment_status": 1, "monthly_income": 25000, "employment_type": "salaried", "electricity_bill_paid_on_time": 1}',
        '{"loan_repayment_status": 0.35, "monthly_income": 0.25, "employment_type": 0.20, "electricity_bill_paid_on_time": 0.20}',
        'Excellent credit profile with consistent repayment history and stable income.',
        '["Consider increasing loan amount eligibility", "Eligible for premium banking services"]',
        'new_application',
        '550e8400-e29b-41d4-a716-446655440011'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440051',
        '550e8400-e29b-41d4-a716-446655440031',
        680,
        'low_risk_high_need',
        88.3,
        'v1.2.0',
        '{"loan_repayment_status": 1, "monthly_income": 18000, "employment_type": "self_employed", "electricity_bill_paid_on_time": 1}',
        '{"loan_repayment_status": 0.40, "monthly_income": 0.15, "employment_type": 0.25, "electricity_bill_paid_on_time": 0.20}',
        'Good credit behavior but higher financial need. Eligible for priority lending.',
        '["Maintain regular income documentation", "Consider building emergency savings"]',
        'periodic_review',
        '550e8400-e29b-41d4-a716-446655440012'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440052',
        '550e8400-e29b-41d4-a716-446655440032',
        520,
        'high_risk_high_need',
        76.8,
        'v1.2.0',
        '{"loan_repayment_status": 0, "monthly_income": 12000, "employment_type": "salaried", "electricity_bill_paid_on_time": 0}',
        '{"loan_repayment_status": -0.45, "monthly_income": -0.20, "employment_type": 0.10, "electricity_bill_paid_on_time": -0.25}',
        'Credit profile needs improvement. Focus on building payment discipline.',
        '["Set up automatic bill payments", "Consider a secured credit card", "Build emergency fund gradually"]',
        'manual_review',
        '550e8400-e29b-41d4-a716-446655440013'
    );

-- Insert sample workflow history
INSERT INTO workflow_history (
    id, application_id, from_stage, to_stage, action_taken, performed_by, decision_data, comments
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440040',
        'application',
        'verification',
        'documents_verified',
        '550e8400-e29b-41d4-a716-446655440011',
        '{"documents_verified": ["income_proof", "identity_proof", "address_proof"]}',
        'All documents verified successfully'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440061',
        '550e8400-e29b-41d4-a716-446655440040',
        'verification',
        'risk_assessment',
        'risk_assessed',
        '550e8400-e29b-41d4-a716-446655440013',
        '{"risk_score": 720, "approval_recommendation": "approve"}',
        'Low risk profile, recommend approval'
    );

-- Insert sample notifications
INSERT INTO notifications (
    id, user_id, title, message, notification_type, entity_type, entity_id, action_url, action_label
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440070',
        '550e8400-e29b-41d4-a716-446655440020',
        'Loan Application Approved',
        'Your loan application APP001-2024 has been approved for ₹50,000',
        'success',
        'loan_application',
        '550e8400-e29b-41d4-a716-446655440040',
        '/applications/550e8400-e29b-41d4-a716-446655440040',
        'View Details'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440071',
        '550e8400-e29b-41d4-a716-446655440021',
        'Documents Required',
        'Please upload income proof for your loan application APP002-2024',
        'warning',
        'loan_application',
        '550e8400-e29b-41d4-a716-446655440041',
        '/applications/550e8400-e29b-41d4-a716-446655440041/documents',
        'Upload Documents'
    );

-- Insert sample system settings
INSERT INTO system_settings (
    id, tenant_id, setting_key, setting_value, setting_type, description
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440080',
        '550e8400-e29b-41d4-a716-446655440001',
        'credit_score_thresholds',
        '{"excellent": 750, "good": 650, "fair": 550, "poor": 450}',
        'model_config',
        'Credit score categorization thresholds'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440081',
        '550e8400-e29b-41d4-a716-446655440001',
        'auto_approval_limits',
        '{"low_risk_high_need": 100000, "low_risk_low_need": 150000}',
        'business_rule',
        'Automatic approval limits by risk category'
    );

-- Insert sample model version
INSERT INTO model_versions (
    id, version, model_type, algorithm, accuracy, precision_score, recall_score, f1_score,
    model_file_path, features_config, is_active, training_data_size, notes
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440090',
        'v1.2.0',
        'credit_scoring',
        'SGDClassifier',
        0.8750,
        0.8695,
        0.8820,
        0.8757,
        '/models/zenith_model_v1_2_0.joblib',
        '["loan_repayment_status", "monthly_income", "employment_type", "electricity_bill_paid_on_time", "mobile_recharge_frequency"]',
        true,
        1500,
        'Production model with improved feature engineering'
    );