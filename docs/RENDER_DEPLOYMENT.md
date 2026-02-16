# 🚀 Render Deployment Guide - IncluScore Backend

> Complete step-by-step guide to deploy IncluScore backend to Render.com

![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Setup](#pre-deployment-setup)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)
- [Monitoring & Logs](#monitoring--logs)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Accounts
- [ ] GitHub account (for code hosting)
- [ ] Render account (https://render.com - free tier available)
- [ ] Supabase account (PostgreSQL database already configured)

### Required Configuration
- [ ] Backend code committed to GitHub
- [ ] All dependencies in `requirements.txt`
- [ ] `.env.local` file with sensitive data
- [ ] FastAPI app properly configured
- [ ] Database migrations ready

---

## 🔧 Pre-Deployment Setup

### Step 1: Prepare Backend Code

Verify your backend structure:

```
backend/
├── main.py                 # FastAPI application
├── database.py             # Database configuration
├── model.py               # ML models
├── explainer.py           # Explainable AI
├── supabase_client.py      # Supabase integration
├── requirements.txt        # Python dependencies
├── .env.example           # Example environment file
└── gunicorn_config.py      # Production config (create if needed)
```

### Step 2: Create Gunicorn Config

Create `backend/gunicorn_config.py`:

```python
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', 8000)}"
backlog = 2048
max_requests = 1000
max_requests_jitter = 50
timeout = 120
keepalive = 5

# Worker processes
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
preload_app = False
daemon = False

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Server mechanics
preload_app = True
proxy_protocol = True
```

### Step 3: Update requirements.txt

Ensure your `requirements.txt` includes:

```txt
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
gunicorn>=21.2.0
python-dotenv>=1.0.0
pandas>=2.1.0
numpy>=1.24.0
scikit-learn>=1.3.0
pydantic>=2.0.0
python-multipart>=0.0.5
asyncpg>=0.29.0
</supabase/supabase-py]>=2.0.0
aiohttp>=3.8.0
```

Install and update locally:

```bash
cd backend
pip install -r requirements.txt
pip freeze > requirements.txt
```

### Step 4: Create Render Configuration Files

Create `render.yaml` in root directory:

```yaml
services:
  - type: web
    name: incluscores-backend
    env: python
    plan: free
    runtime: python-3.11
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "cd backend && gunicorn main:app --worker-class uvicorn.workers.UvicornWorker"
    envVars:
      - key: PORT
        value: 8000
      - key: PYTHONUNBUFFERED
        value: true
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
      - key: CLERK_SECRET_KEY
        sync: false
```

### Step 5: Create startup.sh

Create `backend/startup.sh`:

```bash
#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Run migrations if needed
# python database.py  # Uncomment if needed

# Start the application
gunicorn main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --workers 4 \
    --bind 0.0.0.0:$PORT \
    --timeout 120
```

Make it executable:

```bash
chmod +x backend/startup.sh
```

### Step 6: Verify Locally

Test the build process locally:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Test with gunicorn
gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
```

### Step 7: Commit to GitHub

```bash
git add backend/
git add render.yaml
git commit -m "Prepare backend for Render deployment"
git push origin main
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service

1. **Dashboard → New +**
2. Select **Web Service**
3. **Connect your repository**
   - Select your GitHub repository containing the code
   - Click "Connect"

### Step 3: Configure Service

1. **Basic Information**
   - **Name**: `incluscores-backend`
   - **Runtime**: `Python 3.11`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: 
     ```
     cd backend && gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --workers 4 --bind 0.0.0.0:$PORT --timeout 120
     ```

2. **Plan**
   - Select **Free** or **Starter** tier
   - Free tier is sufficient for development

3. **Environment**
   - Select region closest to your users
   - Free tier only available in certain regions

### Step 4: Add Environment Variables

1. **Scroll to Environment section**
2. **Add the following variables:**

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `8000` | Fixed |
| `SUPABASE_URL` | Your Supabase URL | From Supabase dashboard |
| `SUPABASE_KEY` | Your Supabase key | From Supabase dashboard |
| `SUPABASE_DB_PASSWORD` | Database password | From Supabase |
| `CLERK_SECRET_KEY` | Clerk secret key | From Clerk dashboard |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | From Clerk dashboard |
| `PYTHONUNBUFFERED` | `true` | Enable unbuffered output |

3. **Save each variable** as you add it

### Step 5: Deploy

1. **Click "Create Web Service"**
2. Monitor the deployment process
3. View logs in real-time
4. Wait for "Live" status

**Deployment Status:**
- Red → Failed
- Yellow → In Progress
- Green → Live

---

## 🔐 Environment Variables

### Required Variables

Create `.env.example` in backend:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-public-key
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Application Settings
PORT=8000
ENVIRONMENT=production
LOG_LEVEL=info

# FastAPI
FASTAPI_ENV=production
```

### Adding Environment Variables in Render

**Option 1: Dashboard**
1. Go to Service Settings
2. Find "Environment" section
3. Click "Add Environment Variable"
4. Fill in key and value
5. Click "Add"

**Option 2: Batch Add**
1. Click "Bulk Operations"
2. Paste variables in format: `KEY=value`
3. Click "Add Variables"

---

## 🗄️ Database Setup

### Using Supabase (Already Configured)

Your database is already set up with Supabase. Render will connect via:

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### Initialize Database

If first deployment, run migrations:

1. **SSH into Render Service** (Paid plans only)
   ```bash
   ssh -i /path/to/key [user]@[host]
   cd backend
   python database.py
   ```

2. **Alternative: Local initialization**
   ```bash
   # Connect from local machine
   SUPABASE_URL=... SUPABASE_KEY=... python database.py
   ```

### Verify Database Connection

Check backend logs:

```
INFO: Database connection established
INFO: System initialization completed
```

---

## ✅ Post-Deployment

### Step 1: Verify Deployment

1. **Check Service Status**
   - Should show "Live" status
   - No error messages in logs

2. **Test API Endpoints**
   - Get your Render URL from dashboard
   - Test with curl or Postman:
   ```bash
   curl https://incluscores-backend.onrender.com/docs
   ```

3. **Check API Documentation**
   - Visit `https://incluscores-backend.onrender.com/docs`
   - Should show Swagger UI with all endpoints

### Step 2: Connect Frontend

Update frontend environment variables:

```env
REACT_APP_API_URL=https://incluscores-backend.onrender.com
```

### Step 3: Update CORS Settings

In `backend/main.py`, update CORS configuration:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://incluscores-frontend.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Setup Custom Domain

1. **In Render Dashboard**
   - Go to Service Settings
   - Find "Custom Domain"
   - Click "Add Custom Domain"
   - Enter your domain: `api.incluscores.io`

2. **Update DNS**
   - Add CNAME record pointing to Render URL
   - Wait for DNS propagation

---

## 📊 Monitoring & Logs

### Real-Time Logs

1. **Service Page**
   - Logs display automatically
   - Scroll to see real-time events
   - Use search to filter

2. **Common Log Messages**
   ```
   INFO: Application startup complete
   INFO: Database connection established
   INFO: Started server process
   ```

### Monitoring Performance

1. **Metrics Tab**
   - CPU usage
   - Memory usage
   - Request rate
   - Response times

2. **Alerts**
   - Set up alerts for:
     - Service crashes
     - High CPU usage
     - High memory usage
     - Error rate

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

1. **Service Settings**
2. **Auto-Deploy**: Enable
3. **Deploy from branch**: `main`

Now every push to main automatically deploys!

### Manual Deployment

If needed, trigger manual deployment:

1. **Dashboard → Service**
2. **Click "Deploy"**
3. Select branch
4. Click "Deploy"

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Build Failed

**Error**: `Failed to build`

**Solution**:
- Check build logs for specific error
- Verify `requirements.txt` has all dependencies
- Ensure Python version is compatible
- Try clearing build cache: Settings → Clear Build Cache

#### 2. Service Won't Start

**Error**: `Service failed to start`

**Solution**:
```bash
# Check startup command
# Verify gunicorn is installed
pip install gunicorn

# Test locally
python -m gunicorn main:app --worker-class uvicorn.workers.UvicornWorker
```

#### 3. Module Not Found

**Error**: `ModuleNotFoundError`

**Solution**:
- Add missing module to `requirements.txt`
- Run `pip freeze > requirements.txt`
- Push changes and redeploy

#### 4. Environment Variables Not Applied

**Solution**:
- Verify variables saved in dashboard
- Restart service manually
- Check variable names for typos

#### 5. Database Connection Failed

**Error**: `Connection refused`

**Solution**:
```bash
# Verify Supabase credentials
echo $SUPABASE_URL
echo $SUPABASE_KEY

# Test connection locally
python test_db.py

# Check IP whitelist in Supabase
```

#### 6. Port Mismatch

**Error**: `Cannot bind to port`

**Solution**:
- Use Render's provided `PORT` environment variable
- Start command: `--bind 0.0.0.0:$PORT`
- Don't hardcode port

### Debug Mode

Enable debug logging:

```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

### View Detailed Logs

1. **Service Page**
2. **Logs Tab**
3. Search for errors or specific messages

---

## ⚡ Performance Optimization

### 1. Worker Configuration

Optimize in `gunicorn_config.py`:

```python
workers = 4  # Scale based on instance type
worker_connections = 1000
max_requests = 1000
```

### 2. Connection Pooling

In `database.py`:

```python
pool = await asyncpg.create_pool(
    dsn,
    min_size=10,
    max_size=20,
    command_timeout=60
)
```

### 3. Caching

Add caching for frequently accessed data:

```python
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.decorators import cache

@app.get("/beneficiaries")
@cache(expire=300)
async def get_beneficiaries():
    # Cached for 5 minutes
    pass
```

---

## 🔄 Updates & Rollbacks

### Update Backend

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```

2. **Auto-deployment triggers** (if enabled)
   - Render automatically redeploys
   - Check logs to verify

### Rollback

1. **Service Settings**
2. **Deployments** tab
3. Find previous stable deployment
4. Click **"Redeploy"**

---

## 📋 Deployment Checklist

### Before Deployment
- [ ] All code committed to GitHub
- [ ] `requirements.txt` updated
- [ ] `gunicorn_config.py` created
- [ ] Environment variables documented
- [ ] Database ready and tested
- [ ] API tested locally
- [ ] Build completes locally

### During Deployment
- [ ] Monitor deployment logs
- [ ] Watch for errors
- [ ] Verify service is "Live"

### After Deployment
- [ ] Test all API endpoints
- [ ] Check database connectivity
- [ ] Verify frontend can connect
- [ ] Monitor logs for errors
- [ ] Test with Render URL
- [ ] Setup custom domain
- [ ] Enable auto-deploy

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Supabase Connection](https://supabase.com/docs)

---

## 📞 Support

### Render Support
- Docs: https://render.com/docs
- Support: https://support.render.com

### FastAPI Help
- Docs: https://fastapi.tiangolo.com
- Discord: https://discord.gg/VQjSZaeJmf

---

## 🎯 Next Steps

1. **Monitor Deployment**
   - Watch logs for 24 hours
   - Fix any issues

2. **Setup Monitoring**
   - Enable alerts
   - Configure error tracking

3. **Performance Tuning**
   - Analyze performance metrics
   - Optimize worker count
   - Tune database connections

4. **Documentation**
   - Update API documentation
   - Document environment setup
   - Create runbooks for operations

---

**Last Updated**: February 2026 | **Version**: 2.0.0
