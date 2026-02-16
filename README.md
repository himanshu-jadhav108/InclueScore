# 🏦 IncluScore - AI-Powered Multi-User Credit Scoring System

> **Dynamic Credit Scoring & Guidance System** with Role-Based Access Control, Real-Time Data Processing, and Professional Dashboards

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [User Roles & Dashboards](#user-roles--dashboards)
- [Technology Stack](#technology-stack)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

**IncluScore** is a comprehensive multi-user financial platform built for credit scoring and loan eligibility assessment. It combines machine learning with professional dashboards to provide role-based credit scoring, risk analysis, and borrower guidance.

### Key Highlights:
- ✅ **Multi-User Platform** with Role-Based Access Control (RBAC)
- ✅ **Real-Time Data Processing** with PostgreSQL
- ✅ **AI-Powered Credit Scoring** with Explainable AI
- ✅ **Professional Dashboards** for different user roles
- ✅ **Secure Authentication** with Clerk
- ✅ **Production-Ready** with comprehensive error handling

---

## ✨ Features

### 🔐 Security & Authentication
- Clerk authentication with social login support
- Role-based access control (Admin, Loan Officer, Beneficiary, Bank Manager)
- Session management and automatic user synchronization
- Secure API endpoints with permission validation

### 📊 Dashboard Features
- **Admin Dashboard**: Complete system management and analytics
- **Loan Officer Dashboard**: Beneficiary assessment and loan processing
- **Beneficiary Dashboard**: Personal score tracking and recommendations
- **Bank Manager Dashboard**: Portfolio analytics and business intelligence

### 🤖 AI & Machine Learning
- Dynamic credit scoring with online learning
- Risk categorization and need assessment
- What-If simulation for scenario analysis
- Explainable AI with feature importance
- Continuous model improvement from real data

### 📈 Data & Reporting
- Real-time data synchronization
- Comprehensive beneficiary profiles
- Score history tracking
- Performance analytics and metrics
- Export capabilities

---

## 🏗️ Architecture

### Frontend Architecture
```
frontend/
├── src/
│   ├── pages/           # Role-based dashboard pages
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context for state management
│   ├── api/            # API client and services
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── package.json
```

### Backend Architecture
```
backend/
├── main.py            # FastAPI application
├── database.py        # Database configuration
├── model.py           # ML model implementation
├── explainer.py       # Explainable AI module
├── supabase_client.py # Supabase integration
└── requirements.txt   # Python dependencies
```

### Database Schema
- **Users**: Authentication and role management
- **Beneficiaries**: Borrower profiles and data
- **Scores**: Score history and tracking
- **Audit Logs**: System activity tracking

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (Backend)
- **Node.js 16+** (Frontend)
- **npm or yarn** (Package manager)
- **Supabase Account** (Database)
- **Clerk Account** (Authentication)

### Local Development Setup

#### 1. Clone and Navigate
```bash
git clone https://github.com/yourusername/incluscores.git
cd incluscores
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Supabase and Clerk keys

# Start backend
python main.py
```

Backend runs on: `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.local
# Edit .env with your Clerk and API URLs

# Start frontend
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 📦 Deployment

### Frontend Deployment (Vercel)
See [docs/VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for complete Vercel deployment guide.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

### Backend Deployment (Render)
See [docs/RENDER_DEPLOYMENT.md](./docs/RENDER_DEPLOYMENT.md) for complete Render deployment guide.

**Quick Deploy:**
1. Push code to GitHub
2. Connect GitHub repository to Render
3. Create Web Service with Python runtime
4. Set environment variables in Render dashboard
5. Deploy

---

## 👥 User Roles & Dashboards

| Role | Purpose | Features | Access |
|------|---------|----------|--------|
| **Admin** | System management | User management, analytics, configuration | Full system |
| **Loan Officer** | Loan assessment | Beneficiary assessment, risk analysis, scoring | Beneficiary data + tools |
| **Beneficiary** | Self-service access | Score tracking, history, recommendations | Own data only |
| **Bank Manager** | Business intelligence | Portfolio analytics, performance metrics | Strategic overview |

---

## 💻 Technology Stack

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Routing
- **Clerk** - Authentication

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **PostgreSQL** - Database (via Supabase)
- **Pandas & NumPy** - Data processing
- **Scikit-learn** - Machine learning
- **Python 3.8+** - Runtime

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting
- **GitHub** - Version control

---

## 📚 Documentation

### Core Documentation
- [How to Run Locally](./docs/HOW_TO_RUN.md) - Local development guide
- [Backend Setup](./backend/README.md) - Backend configuration
- [Database Setup](./database/README.md) - Database initialization
- [Transformation Complete](./docs/TRANSFORMATION_COMPLETE.md) - System architecture

### Deployment Guides
- [Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md) - Frontend deployment
- [Render Deployment Guide](./docs/RENDER_DEPLOYMENT.md) - Backend deployment

### Design & UI
- [Visual Design Guide](./docs/VISUAL_DESIGN_GUIDE.md) - Design system
- [UI Redesign Summary](./docs/UI_REDESIGN_SUMMARY.md) - UI improvements
- [Design Quick Reference](./docs/DESIGN_QUICK_REFERENCE.md) - Quick reference

### Management
- [Role Management Guide](./docs/ROLE_MANAGEMENT_GUIDE.md) - User roles guide

### Navigation & Index
- [Documentation Index](./docs/DOCUMENTATION_INDEX.md) - Complete documentation roadmap
- [Setup Complete](./docs/SETUP_COMPLETE.md) - Setup confirmation

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env.local)
```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_DB_PASSWORD=your-database-password

# Clerk
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

---

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Beneficiaries
- `GET /beneficiaries` - List all beneficiaries
- `GET /beneficiaries/{id}` - Get beneficiary details
- `POST /beneficiaries` - Create new beneficiary
- `PUT /beneficiaries/{id}` - Update beneficiary

### Scoring
- `GET /score/{id}` - Get beneficiary score
- `POST /simulate` - Simulate scenario
- `POST /update-score` - Update score

### Admin
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

---

## 🛠️ Development

### Project Structure
```
incluscores/
├── README.md              # Main entry point
├── docs/                  # Comprehensive documentation
│   ├── HOW_TO_RUN.md
│   ├── VERCEL_DEPLOYMENT.md
│   ├── RENDER_DEPLOYMENT.md
│   ├── TRANSFORMATION_COMPLETE.md
│   ├── VISUAL_DESIGN_GUIDE.md
│   ├── UI_REDESIGN_SUMMARY.md
│   ├── DESIGN_QUICK_REFERENCE.md
│   ├── ROLE_MANAGEMENT_GUIDE.md
│   └── DOCUMENTATION_INDEX.md
├── frontend/              # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # FastAPI application
│   ├── main.py
│   ├── model.py
│   ├── database.py
│   └── requirements.txt
├── database/              # Database schemas
└── .gitignore
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest test_*.py -v
```

#### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📝 Environment Setup Checklist

- [ ] Create Supabase account
- [ ] Create Clerk account
- [ ] Set up PostgreSQL database
- [ ] Create `.env.local` in backend
- [ ] Create `.env.local` in frontend
- [ ] Install Python dependencies
- [ ] Install Node dependencies
- [ ] Run backend server
- [ ] Run frontend server
- [ ] Access at http://localhost:3000

---

## 🚀 Production Checklist

- [ ] Set up custom domain
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Set up error tracking
- [ ] Enable analytics
- [ ] Set up security scanning
- [ ] Document deployment procedure

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Roadmap

- [ ] Mobile app for beneficiaries
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and throttling
- [ ] Multi-language support
- [ ] Integration with banking APIs
- [ ] Machine learning model versioning
- [ ] Advanced audit logging
- [ ] Real-time notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ✨ Acknowledgments

Built with ❤️ using FastAPI, React, and PostgreSQL.

---

**Last Updated**: February 2026 | **Version**: 2.0.0
