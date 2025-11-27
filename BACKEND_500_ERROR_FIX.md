# 🚨 500 Error Fix - Backend Configuration

## ✅ **Good News:**
- API path fixed (no more 404)
- CORS resolved (no more CORS errors)
- Frontend successfully reaching backend

## ❌ **Issue: Backend Configuration**
The 500 error means your Render backend is missing required environment variables.

## 🔧 **Quick Fix Steps:**

### **1. Check Render Backend Logs:**
- Go to [render.com](https://render.com) dashboard
- Find your backend service: `liftmate-1`
- Click on it → "Logs" tab
- Look for error messages (likely "MONGO_URI undefined" or similar)

### **2. Set Required Environment Variables in Render:**
In your Render dashboard → Your Backend Service → "Environment" tab, add:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://cheruiyotevans646_db_user:Evans6042@cluster0.uzqsntv.mongodb.net/?appName=Cluster0
JWT_SECRET=VrQf12xp5JoSAFoBY239aHj8u1L22hnfFhc9rtEE5FI=
PORT=10000
FRONTEND_URL=https://lift-mate-clip6auu6-zachariahs-projects-c4361150.vercel.app

# Optional (for payments):
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
MPESA_SHORTCODE=174379
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ENV=sandbox
```

### **3. Generate JWT Secret (if needed):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **4. Restart Backend Service:**
- In Render dashboard → Your service → "Manual Deploy" → "Deploy latest commit"
- Or wait for automatic redeploy after environment variable changes

## 🎯 **Most Common 500 Error Causes:**

1. **Missing MONGO_URI** (90% of cases)
2. **Missing JWT_SECRET** 
3. **MongoDB Atlas IP whitelist** (your local IP might not be whitelisted)
4. **Syntax errors** in environment variables

## 🧪 **Test Backend Health:**
After setting environment variables, visit:
`https://liftmate-1.onrender.com/api/auth/test`

Should return: `{"status":"OK","message":"LiftMate Backend is running"}`

## 📋 **Checklist:**
- [ ] Log into Render dashboard
- [ ] Check backend service logs
- [ ] Set MONGO_URI environment variable
- [ ] Set JWT_SECRET environment variable  
- [ ] Restart backend service
- [ ] Test health endpoint
- [ ] Test registration from frontend

---
**Fix the backend environment variables and your app will work perfectly!** 🚀