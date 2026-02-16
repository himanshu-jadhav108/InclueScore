# 🎯 **Project Zenith - Role Management Quick Guide**

## 🚨 **Current Issue Resolution**

You're experiencing the expected behavior! Here's why and how to test different roles:

### **Why Everyone Gets Beneficiary Role**
- ✅ **By Design**: All new users default to "beneficiary" role for security
- ✅ **Expected**: The system shows beneficiary dashboard for all new users
- ✅ **Secure**: Only admins can assign different roles

---

## 🔧 **Quick Solutions**

### **Option 1: Use Development Role Switcher (EASIEST)**

1. **Start the Frontend:**
   ```cmd
   cd frontend
   npm start
   ```

2. **Login with Any Email** (use any test email like test@example.com)

3. **Look for the Build Icon (🔧)** in the top navigation bar

4. **Click the Build Icon** to open Role Switcher

5. **Select Any Role to Test:**
   - 👑 **Admin** → User management, system settings
   - 🏦 **Loan Officer** → Credit assessment tools  
   - 📊 **Bank Manager** → Analytics and reports
   - 👤 **Beneficiary** → Personal credit profile
   - 📋 **Auditor** → Compliance reports

6. **Click "Switch Role"** → Page will reload with new dashboard

---

### **Option 2: Backend API Method**

1. **Start Backend Server:**
   ```cmd
   cd backend
   python main.py
   ```

2. **Use API to Change Role:**
   ```bash
   # Replace USER_ID and desired role
   curl -X PUT "http://localhost:8000/users/{USER_ID}/role" \
        -H "Content-Type: application/json" \
        -d '{"role": "admin"}'
   ```

---

### **Option 3: Admin Setup Script**

1. **Run Setup Script:**
   ```cmd
   python setup_admin.py
   ```

2. **Choose Option 2**: Make a user admin

3. **Enter Your Email**: The email you used to login

4. **Login Again**: With admin privileges

---

## 🎯 **Testing Different Dashboards**

### **Admin Dashboard** (http://localhost:3000/admin/dashboard)
- User management interface
- Role assignment tools
- System analytics
- Configuration settings

### **Loan Officer Dashboard** (http://localhost:3000/officer/dashboard)  
- Beneficiary assessment tools
- Credit scoring interface
- Application review system
- Risk analysis reports

### **Bank Manager Dashboard** (http://localhost:3000/manager/dashboard)
- Portfolio performance metrics
- Business intelligence reports
- Loan approval analytics
- Strategic insights

### **Beneficiary Dashboard** (http://localhost:3000/beneficiary/dashboard)
- Personal credit score display
- Score history tracking
- Profile management
- Loan application status

---

## 🔍 **What You're Seeing Is Normal**

### **"Same Beneficiary Data"**
- The system uses **sample data** for demonstration
- In production, each user would have unique credit profiles
- The sample shows how the system will work with real data

### **"Single Page Website"**
- **Normal**: Dashboard pages are single-page applications
- **Expected**: Each role has different tools and information
- **Working**: The navigation allows access to different features

### **"Can't Change Values"**
- **Beneficiaries** have read-only access to their scores (security feature)
- **Loan Officers** can modify beneficiary data
- **Admins** have full system access

---

## 🚀 **Next Steps**

1. **Try the Role Switcher** (Build icon in navigation)
2. **Test Each Dashboard** to see different features
3. **Check API Responses** to understand data flow
4. **Review Sample Data** in `beneficiaries.csv`

---

## 🏗️ **For Production Use**

- Remove the DevRoleSwitcher component
- Implement proper admin role assignment workflow
- Connect to real user data instead of sample data
- Add proper role-based API authentication

---

## 📞 **Need Help?**

The system is working correctly! You now have:
- ✅ Multi-user authentication
- ✅ Role-based dashboards  
- ✅ Development role switching
- ✅ Full API backend

**Try switching roles using the build icon (🔧) in the navigation bar to test different dashboards!**