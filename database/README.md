# Project Zenith Database Setup

This directory contains the database schema and setup files for Project Zenith.

## Files

- `schema.sql` - Complete database schema with all tables, indexes, and constraints
- `sample_data.sql` - Sample data for testing and development
- `migrations/` - Future database migrations (to be created)

## Setup Instructions

### 1. PostgreSQL Installation

Make sure you have PostgreSQL 12+ installed with the following extensions:
- `uuid-ossp` (for UUID generation)

### 2. Database Creation

```bash
# Create database
createdb project_zenith

# Or using psql
psql -U postgres -c "CREATE DATABASE project_zenith;"
```

### 3. Schema Setup

```bash
# Run the schema
psql -U postgres -d project_zenith -f schema.sql

# Load sample data (optional)
psql -U postgres -d project_zenith -f sample_data.sql
```

### 4. Environment Configuration

Create a `.env` file in the backend directory with:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/project_zenith
DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_zenith
DB_USER=your_username
DB_PASSWORD=your_password

# Security
SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Database Schema Overview

### Core Tables

1. **users** - User authentication and roles
2. **tenants** - Multi-tenant organization support
3. **beneficiaries** - Extended beneficiary profiles
4. **loan_applications** - Loan application workflow
5. **score_history** - Credit score tracking with explanations
6. **workflow_history** - Application workflow tracking
7. **audit_logs** - Comprehensive audit trail
8. **notifications** - Real-time notification system
9. **external_data_sources** - External API integration tracking
10. **system_settings** - Application configuration
11. **model_versions** - ML model versioning

### User Roles

- **admin** - System administration
- **loan_officer** - Process loan applications
- **beneficiary** - End users applying for loans
- **bank_manager** - Oversight and reporting
- **auditor** - Compliance and audit access

### Key Features

- **UUID Primary Keys** - Better scalability and security
- **JSONB Columns** - Flexible data storage for evolving requirements
- **Audit Trail** - Complete tracking of all system changes
- **Multi-tenancy** - Support for multiple organizations
- **Role-based Access** - Comprehensive permission system
- **Real-time Notifications** - Event-driven communication
- **Model Versioning** - Track ML model performance over time

## Database Backup & Restore

### Backup
```bash
pg_dump -U postgres project_zenith > backup.sql
```

### Restore
```bash
psql -U postgres -d project_zenith < backup.sql
```

## Performance Considerations

- All foreign keys have appropriate indexes
- Composite indexes on frequently queried columns
- JSONB indexes for JSON queries (add as needed)
- Regular VACUUM and ANALYZE for optimal performance

## Security Notes

- All sensitive data should be encrypted at application level
- Use connection pooling for production deployments
- Regular security updates and monitoring
- Implement row-level security if needed for multi-tenancy