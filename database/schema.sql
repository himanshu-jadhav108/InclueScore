-- Project Zenith Database Schema
-- Dynamic Credit Scoring System with Multi-User Support
-- Compatible with PostgreSQL

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('admin', 'loan_officer', 'beneficiary', 'bank_manager', 'auditor');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed');
CREATE TYPE workflow_stage AS ENUM ('application', 'verification', 'risk_assessment', 'approval', 'disbursement');
CREATE TYPE employment_type AS ENUM ('unemployed', 'self_employed', 'salaried', 'business_owner');
CREATE TYPE risk_category AS ENUM ('low_risk_high_need', 'low_risk_low_need', 'high_risk_high_need', 'high_risk_low_need');

-- Users table - Core authentication and role management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(255) UNIQUE, -- Integration with Clerk auth
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'beneficiary',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    tenant_id UUID, -- For multi-tenancy support
    permissions JSONB DEFAULT '{}', -- Custom permissions per user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Tenants table - For multi-organization support
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiaries table - Extended beneficiary profiles
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    beneficiary_code VARCHAR(50) UNIQUE, -- Human readable ID
    
    -- Personal Information
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    education_level VARCHAR(50),
    address JSONB, -- Store complete address as JSON
    
    -- Financial Information
    monthly_income DECIMAL(12, 2),
    employment_type employment_type,
    employer_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    
    -- Credit History Data
    loan_repayment_status INTEGER DEFAULT 0,
    loan_tenure_months INTEGER DEFAULT 0,
    electricity_bill_paid_on_time INTEGER DEFAULT 0,
    mobile_recharge_frequency INTEGER DEFAULT 0,
    
    -- Additional Financial Behavior
    savings_account_balance DECIMAL(12, 2) DEFAULT 0,
    has_fixed_deposits BOOLEAN DEFAULT false,
    credit_card_usage DECIMAL(10, 2) DEFAULT 0,
    utility_payment_history JSONB DEFAULT '{}',
    
    -- Risk Assessment
    is_high_need BOOLEAN DEFAULT false,
    risk_factors JSONB DEFAULT '{}',
    
    -- KYC and Verification
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_documents JSONB DEFAULT '[]',
    verification_status VARCHAR(20) DEFAULT 'pending',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Loan Applications table
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    
    -- Application Details
    loan_amount DECIMAL(12, 2) NOT NULL,
    loan_purpose TEXT,
    tenure_months INTEGER NOT NULL,
    interest_rate DECIMAL(5, 2),
    
    -- Status and Workflow
    status application_status DEFAULT 'draft',
    workflow_stage workflow_stage DEFAULT 'application',
    priority_level INTEGER DEFAULT 1, -- 1-5 priority
    
    -- Approval Details
    approved_amount DECIMAL(12, 2),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Documents and Data
    documents JSONB DEFAULT '[]',
    application_data JSONB DEFAULT '{}',
    internal_notes JSONB DEFAULT '[]',
    
    -- Disbursement
    disbursed_amount DECIMAL(12, 2),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    disbursement_reference VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Credit Scores History table
CREATE TABLE score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    
    -- Score Details
    credit_score INTEGER NOT NULL,
    risk_category risk_category,
    confidence_level DECIMAL(5, 2), -- Model confidence 0-100%
    
    -- Model Information
    model_version VARCHAR(50),
    feature_values JSONB NOT NULL, -- All features used for scoring
    feature_impacts JSONB, -- SHAP values or feature importance
    
    -- Explanation
    explanation TEXT,
    improvement_suggestions JSONB DEFAULT '[]',
    
    -- Context
    calculation_trigger VARCHAR(100), -- What triggered the score calculation
    external_data_sources JSONB DEFAULT '[]', -- APIs or sources used
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    calculated_by UUID REFERENCES users(id)
);

-- Workflow History table - Track application workflow progress
CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
    
    -- Workflow Details
    from_stage workflow_stage,
    to_stage workflow_stage NOT NULL,
    action_taken VARCHAR(100),
    
    -- User and Decision
    performed_by UUID REFERENCES users(id),
    decision_data JSONB DEFAULT '{}',
    comments TEXT,
    
    -- Metadata
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table - Comprehensive system audit trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User Context
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    user_role user_role,
    
    -- Action Details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'beneficiary', 'loan_application', etc.
    entity_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    changes_summary TEXT,
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Metadata
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- External Data Sources table - Track real-time data integrations
CREATE TABLE external_data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    
    -- Source Information
    source_name VARCHAR(100) NOT NULL, -- 'bank_api', 'utility_provider', etc.
    source_type VARCHAR(50), -- 'api', 'manual', 'file_upload'
    
    -- Data
    raw_data JSONB NOT NULL,
    processed_data JSONB,
    data_quality_score DECIMAL(5, 2), -- 0-100 data quality assessment
    
    -- Sync Information
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(20) DEFAULT 'success',
    sync_error TEXT,
    auto_sync_enabled BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table - Real-time notifications system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recipient
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- 'info', 'warning', 'success', 'error'
    
    -- Related Entity
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Action
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- System Settings table - Application configuration
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    
    -- Setting Details
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50), -- 'model_config', 'business_rule', 'ui_config'
    description TEXT,
    
    -- Validation
    validation_schema JSONB,
    is_encrypted BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Model Versions table - ML model versioning and performance tracking
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Model Details
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50), -- 'credit_scoring', 'risk_assessment'
    algorithm VARCHAR(100),
    
    -- Performance Metrics
    accuracy DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall_score DECIMAL(5, 4),
    f1_score DECIMAL(5, 4),
    auc_score DECIMAL(5, 4),
    
    -- Model Files
    model_file_path VARCHAR(500),
    scaler_file_path VARCHAR(500),
    features_config JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT false,
    training_data_size INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_beneficiaries_user_id ON beneficiaries(user_id);
CREATE INDEX idx_beneficiaries_code ON beneficiaries(beneficiary_code);
CREATE INDEX idx_loan_applications_beneficiary ON loan_applications(beneficiary_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_score_history_beneficiary ON score_history(beneficiary_id);
CREATE INDEX idx_score_history_calculated_at ON score_history(calculated_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON loan_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_external_data_sources_updated_at BEFORE UPDATE ON external_data_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion for testing
INSERT INTO tenants (id, name, domain) VALUES 
    (uuid_generate_v4(), 'Default Organization', 'default.zenith.local');

-- Insert sample admin user
INSERT INTO users (id, email, first_name, last_name, role, tenant_id) VALUES 
    (uuid_generate_v4(), 'admin@zenith.local', 'System', 'Administrator', 'admin', 
     (SELECT id FROM tenants WHERE domain = 'default.zenith.local'));

-- Comments for documentation
COMMENT ON TABLE users IS 'Core user authentication and authorization';
COMMENT ON TABLE beneficiaries IS 'Extended beneficiary profiles with financial and personal data';
COMMENT ON TABLE loan_applications IS 'Loan application workflow and status tracking';
COMMENT ON TABLE score_history IS 'Historical credit scores with explanations and feature impacts';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system activities';
COMMENT ON TABLE external_data_sources IS 'Real-time data integration from external APIs';
COMMENT ON TABLE notifications IS 'Real-time notification system for users';
COMMENT ON TABLE model_versions IS 'ML model versioning and performance tracking';