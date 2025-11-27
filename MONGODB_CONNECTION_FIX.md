# 🔥 MongoDB Connection Issue - Complete Fix Guide

## 🎯 **Issue Identified:**
```
"Operation `users.findOne()` buffering timed out after 10000ms"
MongooseError
```

This is a **MongoDB connection timeout**. The backend can't connect to your MongoDB Atlas database.

## 🛠️ **Step-by-Step Fix:**

### Step 1: Check MongoDB Atlas IP Whitelist

**Critical: Render's IP addresses are not whitelisted in MongoDB Atlas**

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Click your cluster** → **"Network Access"** tab
3. **Check current IP Access List** - probably shows your local IP only
4. **Add Render's IP Range**:
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for testing
   - **OR** use Render's specific IP ranges if available

### Step 2: Test MongoDB Connection String

**Verify your connection string works:**

1. **Download [MongoDB Compass](https://www.mongodb.com/products/compass)**
2. **Test the connection string**:
   ```
   mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0
   ```
3. **If connection fails** - the issue is with MongoDB Atlas settings

### Step 3: Set Environment Variables in Render

**Go to Render Dashboard → liftmate-46f4 → Environment tab**

**Ensure these are set:**

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `VrQf12xp5JoSAFoBY239aHj8u1L22hnfFhc9rtEE5FI=` |
| `FRONTEND_URL` | `https://lift-mate.vercel.app` |
| `NODE_ENV` | `production` |

### Step 4: Check MongoDB Atlas Database User

**Verify database access:**

1. **MongoDB Atlas** → **"Database Access"** tab
2. **Ensure your user** has proper permissions:
   - Database User: `cheruiyotevans646_db_user`
   - Role: `Atlas admin` (or at least `readWrite` on the database)

## 🔍 **MongoDB Atlas Configuration Checklist:**

### Database User Settings:
- ✅ **Username**: `cheruiyotevans646_db_user`
- ✅ **Password**: `Evans6042`
- ✅ **Authentication**: Password
- ✅ **Role**: Atlas admin

### Network Access:
- ✅ **IP Access List**: Include 0.0.0.0/0 (for testing)
- ✅ **OR** Add specific Render IP ranges

### Database Settings:
- ✅ **Database Name**: (MongoDB Atlas creates automatically)
- ✅ **Connection Method**: SRV connection string
- ✅ **Connection String**: Properly formatted

## 🧪 **Test MongoDB Connection:**

### Test with MongoDB Compass:
1. Open MongoDB Compass
2. Enter connection string: `mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0`
3. Should connect successfully and show databases

### Test with Command Line:
```bash
# If you have MongoDB installed locally
mongosh "mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0"
```

## 🚨 **Common MongoDB Atlas Issues:**

### Issue 1: IP Not Whitelisted
**Error**: Connection timeout
**Solution**: Add 0.0.0.0/0 to IP Access List temporarily

### Issue 2: Wrong Username/Password
**Error**: Authentication failed
**Solution**: Verify credentials in Database Access tab

### Issue 3: Cluster Paused
**Error**: Connection timeout
**Solution**: Check if cluster is active in Atlas dashboard

### Issue 4: Network Issues
**Error**: DNS resolution failed
**Solution**: Check internet connection, try again later

## 🎯 **Next Steps:**

1. **Fix MongoDB Atlas IP whitelist** (most common issue)
2. **Test connection string** with MongoDB Compass
3. **Restart Render service** after fixing
4. **Test registration** again

## 📞 **Quick Test Commands:**

**Test backend health:**
```bash
curl https://liftmate-46f4.onrender.com/api/auth/test
```

**Test registration:**
```bash
curl -X POST "https://liftmate-46f4.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123","role":"passenger"}'
```

## 🔄 **After Fix:**

You should see:
- MongoDB connects successfully
- Registration returns user data and token
- No timeout errors

**The #1 cause is usually MongoDB Atlas IP whitelist not including Render's IP addresses!**