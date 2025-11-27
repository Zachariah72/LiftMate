# 🚨 Fix Registration Error - Step by Step Guide

## 🔍 **Issue**: Getting 500 error when registering users

The registration is failing with a 500 error. This is likely due to **missing or incorrect environment variables** in your Render deployment.

## 🛠️ **Quick Fix Steps**

### Step 1: Commit and Push the Fixes

I've updated the code to fix deployment issues. First, commit and push the changes:

```bash
git add .
git commit -m "Fix registration error and improve logging"
git push origin main
```

Wait 2-3 minutes for Render to auto-deploy.

### Step 2: Check Render Environment Variables

After deployment, go to **Render Dashboard** → Your Service (`liftmate-46f4`) → **"Environment" tab**

**Verify these variables are set**:

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ✅ Should be set |
| `PORT` | (leave empty - Render sets this) | ✅ Render manages this |
| `MONGO_URI` | `mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0` | ⚠️ **CHECK THIS** |
| `JWT_SECRET` | `VrQf12xp5JoSAFoBY239aHj8u1L22hnfFhc9rtEE5FI=` | ⚠️ **CHECK THIS** |
| `FRONTEND_URL` | `https://lift-mate.vercel.app` | ⚠️ **CHECK THIS** |

### Step 3: Fix Missing Variables

If any of the above variables are missing or empty:

1. **Click "Add Environment Variable"**
2. **Add the missing variables** using the values from [`backend/.env.example`](backend/.env.example)
3. **Save and restart your service**

### Step 4: Test the Fix

After updating environment variables:

1. **Wait 2-3 minutes** for the service to restart
2. **Try registering again** at https://lift-mate.vercel.app/register
3. **Check the registration response** in browser developer tools

## 🔍 **Debugging Steps**

### Check Backend Logs

1. **Render Dashboard** → Your Service → **"Logs" tab**
2. **Look for error messages** during startup
3. **Common errors**:
   - `MONGO_URI is not defined`
   - `JWT_SECRET is not defined`
   - `MongoDB connection failed`

### Test Individual Components

Try these API calls to isolate the issue:

```bash
# Test 1: Basic health check
curl https://liftmate-46f4.onrender.com/api/auth/test

# Test 2: Try registration with verbose output
curl -X POST "https://liftmate-46f4.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123","role":"passenger"}' \
  -v
```

## 🐛 **Common Issues & Solutions**

### Issue 1: MongoDB Connection Failed
```
Error: MongoURI is not defined
```
**Solution**: Set `MONGO_URI` in Render environment variables

### Issue 2: JWT Secret Missing
```
Error: JWT_SECRET is not defined
```
**Solution**: Set `JWT_SECRET` in Render environment variables

### Issue 3: CORS Error
```
Access to fetch blocked by CORS policy
```
**Solution**: Set `FRONTEND_URL` to `https://lift-mate.vercel.app` in Render

### Issue 4: MongoDB Authentication Failed
```
Error: Authentication failed
```
**Solutions**:
- Verify MongoDB Atlas username/password
- Check IP whitelist in MongoDB Atlas
- Ensure connection string is correct

## 📋 **Environment Variables Checklist**

Copy these exact values to your Render dashboard:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0
JWT_SECRET=VrQf12xp5JoSAFoBY239aHj8u1L22hnfFhc9rtEE5FI=
FRONTEND_URL=https://lift-mate.vercel.app
```

## 🚀 **After Fix**

Once the registration works, you should see:

1. **Successful registration response**:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "...",
       "name": "...",
       "email": "...",
       "role": "..."
     }
   }
   ```

2. **No console errors** in browser developer tools

3. **Successful redirect** after registration

## 📞 **If Still Not Working**

1. **Check Render logs** for specific error messages
2. **Verify MongoDB Atlas** is accessible
3. **Test the connection string** in MongoDB Compass
4. **Ensure IP access** is configured in MongoDB Atlas

## 🔄 **Redeploy After Changes**

After updating environment variables:
1. The service should automatically restart
2. If not, go to Render Dashboard → Manual Deploy → "Deploy latest commit"
3. Wait 2-3 minutes for deployment to complete

---

**Need help?** Check the Render service logs for specific error messages and ensure all environment variables match the template in [`backend/.env.example`](backend/.env.example).