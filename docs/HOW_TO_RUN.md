# 🚀 How to Run Project Zenith - Multi-User Credit Scoring System

## 📋 Prerequisites

### Required Software:
- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (package manager)
- **Git** (version control)

### Environment Setup:
1. **Clone the repository** (if not already done)
2. **Database**: Supabase PostgreSQL (already configured)
3. **Authentication**: Clerk account (keys in .env.local)

---

## 🎯 Quick Start Guide

### Step 1: Start the Backend Server 🔧

```bash
# Navigate to backend directory
cd "C:\Users\KARTHIK\Desktop\sih-2\backend"

# Activate virtual environment (if you have one)
# For Windows:
venv\Scripts\activate
# For PowerShell:
.\venv\Scripts\Activate.ps1

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **Backend should now be running on:** `http://localhost:8000`

---

### Step 2: Start the Frontend Application 🎨

```bash
# Open a NEW terminal/command prompt
# Navigate to frontend directory
cd "C:\Users\KARTHIK\Desktop\sih-2\frontend"

# Install dependencies (if not already installed)
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ **Frontend should now be running on:** `http://localhost:3000`

---

## 🌟 Testing the Multi-User System

### Step 3: Access the Application

1. **Open your browser** and go to: `http://localhost:3000`
2. **You should see the new landing page** with multi-user features

### Step 4: Test User Registration & Roles

#### Option A: Create New Users
1. Click **"Sign Up"** on the landing page
2. Register with different email addresses
3. Each new user will be assigned the **"beneficiary"** role by default

#### Option B: Test with Sample Users
The system has sample data. You can:
1. **Sign in with Clerk** using any email
2. The system will automatically create a database user
3. Default role: **beneficiary**

### Step 5: Test Role-Based Dashboards

#### As a Beneficiary (Default Role):
- View personal credit profile
- See score history and recommendations
- Access self-service features

#### To Test Other Roles:
You need to manually update user roles in the database or create an admin interface.

**Quick Role Assignment (for testing):**
```bash
# Use the backend API to update user role
curl -X PUT http://localhost:8000/users/{user_id}/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

#### Dashboard Access by Role:
- **Admin**: `http://localhost:3000/admin` - System management
- **Loan Officer**: `http://localhost:3000/loan-officer` - Assessment tools  
- **Bank Manager**: `http://localhost:3000/bank-manager` - Strategic analytics
- **Beneficiary**: `http://localhost:3000/beneficiary` - Personal dashboard

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem: "Module not found"**
```bash
# Install missing dependencies
pip install fastapi uvicorn asyncpg python-dotenv pandas scikit-learn joblib
```

**Problem: "Database connection failed"**
- Check your `.env.local` file has correct Supabase credentials
- Verify Supabase database is accessible

**Problem: "Port 8000 already in use"**
```bash
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### Frontend Issues:

**Problem: "npm command not found"**
- Install Node.js from: https://nodejs.org/

**Problem: "Port 3000 already in use"**
- The system will automatically suggest another port
- Or kill the process using port 3000

**Problem: "Authentication errors"**
- Check Clerk API keys in your environment variables
- Verify Clerk project configuration

---

## 📊 System Verification

### Test the System is Working:

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status": "healthy", ...}`

2. **Frontend Loading:**
   - Visit `http://localhost:3000`
   - Should see the Project Zenith landing page

3. **Database Connection:**
   ```bash
   curl http://localhost:8000/beneficiaries
   ```
   Should return beneficiary data

---

## 🎯 User Testing Scenarios

### Scenario 1: New Beneficiary Registration
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Complete Clerk registration
4. Should automatically redirect to beneficiary dashboard
5. View personal credit profile and score

### Scenario 2: Admin User Management  
1. Update a user's role to "admin" via API
2. Sign in as that user
3. Should redirect to admin dashboard
4. View system analytics and user management

### Scenario 3: Loan Officer Assessment
1. Set user role to "loan_officer"
2. Access loan officer dashboard  
3. View beneficiary list and risk assessments
4. Test assessment tools and search functionality

---

## 🚀 Production Deployment

When ready for production:

### Backend Deployment:
```bash
# Use a production WSGI server
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment:
```bash
# Build for production
npm run build

# Serve the build folder
npm install -g serve
serve -s build
```

---

## 📞 Support

If you encounter issues:

1. **Check the console logs** in browser developer tools
2. **Verify both servers are running** (backend on 8000, frontend on 3000)
3. **Test API endpoints directly** using curl or Postman
4. **Check database connectivity** via Supabase dashboard

---

## 🎉 Success Indicators

✅ **Backend running** on port 8000  
✅ **Frontend running** on port 3000  
✅ **User registration working** (Clerk integration)  
✅ **Role-based routing working** (automatic dashboard redirects)  
✅ **Database operations working** (beneficiary data loading)  
✅ **Multi-user dashboards accessible**  

**You now have a fully functional enterprise-ready multi-user credit scoring platform!** 🚀