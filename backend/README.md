# Project Zenith Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Run the installation script
install_dependencies.bat

# Or manually install:
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create or update `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_DB_PASSWORD=your-database-password

# Optional: Service Role Key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: You need to get the database password from your Supabase dashboard:
1. Go to Settings → Database
2. Copy the password or generate a new one
3. Add it as `SUPABASE_DB_PASSWORD` in your `.env.local`

### 3. Test Database Connection
```bash
python test_db.py
```

### 4. Start the Server
```bash
python main.py
```

The server will start at: `http://localhost:8000`

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
**Error**: `asyncpg.exceptions.InvalidAuthorizationSpecificationError`

**Solutions**:
- Check your `SUPABASE_DB_PASSWORD` in `.env.local`
- Ensure your Supabase project is active
- Verify the project ID in `SUPABASE_URL`

#### 2. Module Import Errors
**Error**: `ModuleNotFoundError: No module named 'asyncpg'`

**Solution**:
```bash
pip install asyncpg python-dotenv
```

#### 3. Model Training Errors
**Error**: Model file not found

**Solution**: The system will automatically train a model from database data on first run.

### Database Connection Formats

Supabase uses different connection formats. Try these if the default doesn't work:

**Option 1 (Connection Pooler)**:
```
postgresql://postgres.project-id:password@aws-0-region.pooler.supabase.com:6543/postgres
```

**Option 2 (Direct Connection)**:
```
postgresql://postgres:password@db.project-id.supabase.co:5432/postgres
```

**Option 3 (Transaction Mode)**:
```
postgresql://postgres.project-id:password@aws-0-region.pooler.supabase.com:5432/postgres
```

## 🏗️ Architecture Overview

### New Features (v2.0.0)

1. **PostgreSQL Database Integration**
   - Replaces CSV-based data storage
   - Real-time data synchronization
   - Comprehensive audit trails

2. **Multi-User System**
   - Role-based access control
   - User management APIs
   - Tenant isolation

3. **Enhanced APIs**
   - `/beneficiaries` - List all beneficiaries
   - `/beneficiary/{id}` - Get specific beneficiary
   - `/score-history/{id}` - Score tracking
   - `/users` - User management
   - `/health` - System status

4. **Real-time Features**
   - Dynamic score calculation
   - Score history tracking
   - Model performance monitoring

### Database Tables

- **users** - Authentication and user roles
- **beneficiaries** - Extended beneficiary profiles
- **score_history** - Credit score tracking
- **loan_applications** - Application workflow
- **audit_logs** - System activity tracking

## 🎯 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | System health check |
| GET | `/beneficiaries` | List all beneficiaries |
| GET | `/beneficiary/{id}` | Get beneficiary details |
| POST | `/update` | Update beneficiary data |
| POST | `/simulate` | Score simulation (What-if) |
| GET | `/score-history/{id}` | Score history |
| POST | `/users` | Create new user |

### Example Requests

**Get All Beneficiaries**:
```bash
curl http://localhost:8000/beneficiaries
```

**Get Specific Beneficiary**:
```bash
curl http://localhost:8000/beneficiary/550e8400-e29b-41d4-a716-446655440030
```

**Health Check**:
```bash
curl http://localhost:8000/health
```

## 🔮 Next Steps

1. **Frontend Integration**: Update React app to use new database-based APIs
2. **Authentication**: Integrate Clerk authentication with database users
3. **Multi-Page Application**: Create role-based dashboards
4. **Real-time Features**: WebSocket connections for live updates
5. **Advanced Analytics**: Reporting and dashboard features

## 📞 Support

If you encounter issues:

1. Check the logs in the terminal
2. Verify your `.env.local` configuration
3. Test database connection with `test_db.py`
4. Ensure all dependencies are installed

The system is now ready for multi-user, database-driven operations! 🎉