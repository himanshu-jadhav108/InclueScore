# Render Deployment Guide for Zenith Backend

## 🚨 Critical: Environment Variables Setup

The backend running on Render (https://zenith-iiu3.onrender.com) needs the following environment variables configured in the Render dashboard.

### Required Environment Variables

Go to your Render dashboard → Your Service → Environment tab and add these variables:

```
SUPABASE_URL=https://yxvnhihcaebebayeqygi.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dm5oaWhjYWViZWJheWVxeWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNDE2NzUsImV4cCI6MjA3NTcxNzY3NX0.Auw58ESMISQsbZC9Nj113zmRoqossK3JJwXUeqj4qJY
SUPABASE_DB_PASSWORD=Supabase@123
```

## 🔧 How to Add Environment Variables on Render

1. Log in to your Render dashboard: https://dashboard.render.com
2. Navigate to your service: **zenith-iiu3**
3. Click on the **Environment** tab in the left sidebar
4. Click **Add Environment Variable**
5. Add each of the three variables above:
   - Key: `SUPABASE_URL`
   - Value: `https://yxvnhihcaebebayeqygi.supabase.co`
   - Click **Add**
6. Repeat for `SUPABASE_KEY` and `SUPABASE_DB_PASSWORD`
7. Click **Save Changes**

**Important**: After saving, Render will automatically redeploy your service with the new environment variables.

## ⚠️ Common Issues & Solutions

### Issue 1: "Tenant or user not found" Error

**Cause**: This error means the database password is incorrect or not set.

**Solution**:
1. Verify your Supabase database password:
   - Go to Supabase Dashboard → Settings → Database
   - Copy the correct password (or reset it if needed)
2. Update `SUPABASE_DB_PASSWORD` in Render's environment variables
3. Make sure there are no extra spaces or quotes in the password

### Issue 2: Password with Special Characters

**Cause**: If your password contains special characters like `@`, `#`, `$`, etc.

**Solution**: 
- The code automatically URL-encodes the password
- Just enter the password as-is in the environment variable (e.g., `Supabase@123`)
- Don't manually URL-encode it (don't use `Supabase%40123`)

### Issue 3: Connection Timeout

**Cause**: Supabase region might be different, or connection pooler settings are incorrect.

**Solution**: The code tries multiple connection formats automatically:
1. Direct connection: `db.{project_id}.supabase.co:5432`
2. Connection pooler (ap-south-1): `aws-0-ap-south-1.pooler.supabase.com:6543`
3. Connection pooler (ap-southeast-1): `aws-0-ap-southeast-1.pooler.supabase.com:6543`
4. Session mode: `aws-0-ap-south-1.pooler.supabase.com:5432`

If all fail, check your Supabase project's region and update the connection URLs in `database.py`.

### Issue 4: Service Role Key for Admin Operations

If you need full admin access (for schema changes, etc.), add:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get this from: Supabase Dashboard → Settings → API → service_role key

## 🧪 Testing the Connection

After configuring environment variables on Render:

1. Check the deployment logs on Render
2. Look for these messages:
   - ✅ `Database connection successful with URL format X`
   - ✅ `System initialization completed`

3. Test the API endpoint:
   ```bash
   curl https://zenith-iiu3.onrender.com/
   ```

4. If you see errors, check the logs for:
   - Which connection format was attempted
   - The exact error message from PostgreSQL
   - Whether environment variables were loaded correctly

## 📝 Verifying Supabase Credentials

To verify your credentials are correct:

1. **Supabase URL**: 
   - Go to Supabase Dashboard → Settings → API
   - Copy the "Project URL" - should match your `SUPABASE_URL`

2. **Supabase Anon Key**:
   - Same page, copy "anon public" key
   - Should match your `SUPABASE_KEY`

3. **Database Password**:
   - Go to Settings → Database
   - You set this when you created the project
   - If you forgot it, you can reset it (⚠️ this will disconnect all existing connections)

## 🔄 Redeploying After Changes

After updating environment variables on Render:

1. Render will automatically trigger a redeploy
2. Wait for the deployment to complete (check the "Events" tab)
3. Once deployed, check the logs for successful connection messages
4. Test your endpoints

## 🆘 Still Having Issues?

If you're still experiencing connection issues:

1. **Check Supabase Project Status**:
   - Make sure your Supabase project is active (not paused)
   - Free tier projects pause after inactivity

2. **Check IP Restrictions**:
   - Go to Supabase Dashboard → Settings → Database
   - Ensure "Connection Pooling" is enabled
   - Check if there are any IP restrictions

3. **Verify Database Schema**:
   - Make sure all required tables exist
   - Run the schema.sql file if needed

4. **Check Render Service Status**:
   - Ensure your Render service is not in a "suspended" state
   - Free tier services spin down after inactivity

## 📚 Additional Resources

- Supabase Connection Docs: https://supabase.com/docs/guides/database/connecting-to-postgres
- Render Environment Variables: https://render.com/docs/environment-variables
- Render Logs: https://render.com/docs/logs
