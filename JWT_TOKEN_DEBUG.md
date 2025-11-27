# 🔐 JWT Token Issue - Login to Driver Dashboard

## 🎯 **Issue Identified:**
```
Error fetching drivers: Request failed with status code 400
{"message":"Invalid token"}
```

## 🔍 **Root Cause:**
The user can **register and login successfully**, but when trying to access protected endpoints (like fetching drivers), the **JWT token is invalid**.

## 🛠️ **Debug Steps:**

### Step 1: Check Browser Console
**In your Vercel app** (https://lift-mate.vercel.app/):
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Look for any JavaScript errors** during login/dashboard access
4. **Go to Application tab** → **Local Storage** → Check if token exists

### Step 2: Check Token Storage
**After successful login:**
1. **Open Developer Tools** → **Application** → **Local Storage**
2. **Look for `token` or `authToken`** 
3. **Copy the token value** - should be a long JWT string starting with `eyJ`

### Step 3: Test Token with Backend
**Use the token to test API calls:**

```bash
# Replace YOUR_TOKEN_HERE with the actual token from localStorage
curl -X GET "https://liftmate-46f4.onrender.com/api/auth/test" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected result:**
```json
{
  "status": "OK",
  "message": "LiftMate Backend is running",
  "timestamp": "2025-11-27T09:55:15.427Z"
}
```

### Step 4: Test Protected Endpoint
```bash
# Test fetching rides with the token
curl -X GET "https://liftmate-46f4.onrender.com/api/rides" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected result:** Should return empty array or user rides, not "Invalid token"

## 🔧 **Common Token Issues:**

### Issue 1: Token Not Stored
**Problem:** User logs in successfully but token isn't saved to localStorage
**Solution:** Check frontend login code for localStorage.setItem calls

### Issue 2: Token Expired
**Problem:** JWT token expires after 1 day, but user is trying old token
**Solution:** User needs to login again to get fresh token

### Issue 3: Token Corrupted
**Problem:** Token string is malformed or incomplete
**Solution:** Clear browser storage and login again

### Issue 4: Authorization Header Missing
**Problem:** Frontend isn't sending Authorization header with requests
**Solution:** Check API calls include proper headers

## 🧪 **Frontend Debug Code:**

**Add this to your browser console after login:**
```javascript
// Check if token exists in localStorage
console.log('Token in localStorage:', localStorage.getItem('token'));

// Check if token is being sent in requests
// Open Network tab and look for Authorization header in API calls

// Test token manually
const token = localStorage.getItem('token');
if (token) {
  // Decode JWT to see contents
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Token expires:', new Date(payload.exp * 1000));
}
```

## 🎯 **Quick Fixes:**

### Fix 1: Clear Browser Storage
1. **Open Developer Tools** → **Application** → **Local Storage**
2. **Delete all keys** (especially `token`, `user`, `authToken`)
3. **Refresh page** and login again

### Fix 2: Check JWT Secret
**In Render Dashboard**, ensure `JWT_SECRET` is exactly:
```
VrQf12xp5JoSAFoBY239aHj8u1L22hnfFhc9rtEE5FI=
```

### Fix 3: Test Registration Flow
1. **Register a new user**
2. **Check token is created and stored**
3. **Test API calls immediately after login**

## 📞 **Expected Workflow:**

1. **User registers/logins** → Gets JWT token
2. **Token stored in localStorage** → Frontend retrieves for API calls
3. **API requests include Authorization header** → Backend validates token
4. **Protected endpoints work** → Returns data instead of "Invalid token"

## 🚨 **If Still Not Working:**

1. **Check Render logs** for JWT validation errors
2. **Test with a fresh user registration**
3. **Verify frontend is sending Authorization headers correctly**
4. **Ensure no CORS issues** with token-based requests

**The key is ensuring the token from login is properly stored and sent with subsequent API requests!**