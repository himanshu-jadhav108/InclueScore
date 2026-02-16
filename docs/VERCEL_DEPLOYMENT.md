# 🚀 Vercel Deployment Guide - IncluScore Frontend

> Complete step-by-step guide to deploy IncluScore frontend to Vercel

![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Setup](#pre-deployment-setup)
- [Deployment Options](#deployment-options)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

---

## ✅ Prerequisites

### Required Accounts
- [ ] GitHub account (for code hosting)
- [ ] Vercel account (free tier works great)
- [ ] Clerk account (for authentication - already configured)

### Required Local Setup
- [ ] Node.js 16+ installed
- [ ] Git installed and configured
- [ ] Frontend code committed to GitHub repository
- [ ] `.env.local` file with all necessary variables

---

## 🔧 Pre-Deployment Setup

### Step 1: Update Environment Variables

Update your frontend `package.json`:

```json
{
  "name": "incluscores-frontend",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Step 2: Create Production Environment Files

Create `.env.production` in the frontend directory:

```env
REACT_APP_API_URL=https://incluscores-backend.onrender.com
REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

Create `.env.development` for local testing:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

### Step 3: Verify Build Locally

```bash
cd frontend

# Install dependencies
npm install

# Create production build
npm run build

# Test build locally (optional)
npm install -g serve
serve -s build
```

This ensures your application builds successfully before deploying.

### Step 4: Push to GitHub

```bash
cd frontend

# Stage all changes
git add .

# Commit changes
git commit -m "Prepare frontend for Vercel deployment"

# Push to GitHub
git push origin main
```

---

## 🚀 Deployment Options

### Option 1: Git Integration (Recommended)

**Steps:**

1. **Sign in to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "New Project"

2. **Import GitHub Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `incluscores-frontend`
   - **Framework**: Select "Create React App"
   - **Root Directory**: `frontend/` (if monorepo) or leave empty

4. **Environment Variables**
   - Click "Environment Variables"
   - Add all variables from `.env.production`:
     ```
     REACT_APP_API_URL = https://incluscores-backend.onrender.com
     REACT_APP_CLERK_PUBLISHABLE_KEY = your-clerk-publishable-key
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://incluscores-frontend.vercel.app`

---

### Option 2: Vercel CLI

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   - Follow the prompts to authenticate

3. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Configure Environment Variables**
   - During deployment, Vercel will prompt for environment variables
   - Or add them in Vercel dashboard Settings → Environment Variables

---

### Option 3: GitHub Actions CI/CD (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🔐 Environment Variables

### Required Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `https://incluscores-backend.onrender.com` |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |

### Adding Environment Variables

**Via Vercel Dashboard:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable with its value
4. Select which environments to apply (Development, Preview, Production)
5. Click "Save"

**Via Vercel CLI:**
```bash
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_CLERK_PUBLISHABLE_KEY
```

---

## ✅ Post-Deployment

### Step 1: Verify Deployment

1. **Check Deployment Status**
   - Go to Vercel dashboard
   - Verify the deployment shows "Ready"

2. **Test Application**
   - Visit your Vercel URL: `https://incluscores-frontend.vercel.app`
   - Test login with Clerk
   - Verify API connectivity to backend

3. **Check Logs**
   - Click "Deployments"
   - View logs for any errors

### Step 2: Configure Custom Domain

1. **In Vercel Dashboard**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your custom domain

2. **Update DNS Records**
   - Follow Vercel's DNS configuration guide
   - Add `A` or `CNAME` records as specified
   - Wait for DNS propagation (can take 24-48 hours)

3. **Enable SSL**
   - Vercel automatically provides SSL certificates
   - No additional action needed

### Step 3: Set Production Variables

Update backend connection string for production:

```env
REACT_APP_API_URL=https://incluscores-backend.onrender.com
```

### Step 4: Setup Analytics

Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

Add to your `App.js`:

```javascript
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel automatically deploys when:**
- Push to main branch (if configured)
- Pull request created (preview deployment)
- Manual deployment triggered

### Preview Deployments

Preview deployments are created automatically for:
- Pull requests
- Commit to non-main branches
- Manual deployment

**View Preview URL:**
- GitHub PR → Check for Vercel bot comment
- Vercel Dashboard → Deployments tab

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Build Fails with "MODULE_NOT_FOUND"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. API Connection Failed

**Solution:**
- Verify `REACT_APP_API_URL` is correct
- Check backend is running and accessible
- Verify CORS headers in backend

#### 3. Clerk Authentication Not Working

**Solution:**
- Verify `REACT_APP_CLERK_PUBLISHABLE_KEY` is set
- Check Clerk dashboard for application settings
- Ensure domain is whitelisted in Clerk

#### 4. Static Files Not Loading

**Solution:**
- Check `public/` directory structure
- Verify file paths in code
- Clear Vercel cache: Project Settings → Git → Clear Build Cache

#### 5. Environment Variables Not Applied

**Solution:**
```bash
# Redeploy to apply new variables
vercel --prod

# Or through Vercel CLI
vercel env list  # View current variables
vercel env pull  # Pull from Vercel
```

---

## ⚡ Performance Optimization

### 1. Enable Gzip Compression

Vercel automatically enables Gzip, but verify in:
- Network tab → Response headers → `content-encoding: gzip`

### 2. Optimize Image Loading

```javascript
import Image from 'next/image';  // If using Next.js
// or use lazy loading for React
<img loading="lazy" src="..." />
```

### 3. Code Splitting

React automatically code-splits with dynamic imports:

```javascript
const Dashboard = React.lazy(() => import('./Dashboard'));
```

### 4. Monitor Performance

**Check Vercel Analytics:**
1. Dashboard → Analytics tab
2. Monitor Core Web Vitals
3. Identify slow pages

### 5. Configure Caching

Create `vercel.json` in frontend directory:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm start",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=300"
        }
      ]
    }
  ]
}
```

---

## 📊 Monitoring & Debugging

### Vercel Logs

1. **Deployment Logs**
   - Project Dashboard → Deployments
   - Click deployment → View logs

2. **Runtime Logs**
   - Dashboard → Logs tab
   - Real-time application logs

3. **Analytics**
   - Dashboard → Analytics tab
   - Performance metrics

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/react
```

Initialize in `index.js`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## 🔄 Rollback

### If Deployment Goes Wrong

1. **Via Vercel Dashboard**
   - Go to Deployments tab
   - Click previous successful deployment
   - Click "Redeploy"

2. **Via Git**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 📋 Deployment Checklist

### Before Deployment
- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] `.env.production` file created
- [ ] Backend deployed and running
- [ ] GitHub repository up to date
- [ ] Build completes without errors

### During Deployment
- [ ] Monitor deployment progress
- [ ] Check Vercel build logs
- [ ] Verify environment variables applied

### After Deployment
- [ ] Application loads successfully
- [ ] Test all user journeys
- [ ] Verify API connectivity
- [ ] Check console for errors
- [ ] Monitor analytics dashboard
- [ ] Test on multiple devices

---

## 📞 Support

### Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Clerk Documentation](https://clerk.com/docs)

### Getting Help
- Vercel Support: https://support.vercel.com
- Community: Discord or GitHub Issues

---

## 🎯 Next Steps

1. **Custom Domain Setup**
   - Configure domain in Vercel
   - Update analytics tracking

2. **Enable SSL/HTTPS**
   - Already automatic with Vercel
   - No additional steps needed

3. **Setup Monitoring**
   - Enable Vercel Analytics
   - Setup error tracking with Sentry

4. **CI/CD Pipeline**
   - Configure automatic deployments
   - Setup preview environments

---

**Last Updated**: February 2026 | **Version**: 2.0.0
