# LiftMate Full Stack Deployment Guide (Vercel + Render)

This guide covers deploying your LiftMate app with **Frontend on Vercel** and **Backend on Render**.

## 🚀 Architecture Overview

- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js/Express API deployed on Render
- **Database**: MongoDB Atlas
- **Payments**: M-Pesa (Safaricom) + Stripe

## 📋 Prerequisites

1. **Accounts Required**:
   - Vercel account (free)
   - Render account (free)
   - MongoDB Atlas account (free)
   - Stripe account (test mode)
   - M-Pesa developer account (Safaricom)

2. **Your App URLs** (replace with actual values):
   - Frontend Vercel: `https://your-app.vercel.app`
   - Backend Render: `https://your-backend.onrender.com`

## 🔧 Step 1: Backend Deployment (Render)

### 1.1 Deploy Backend to Render
Follow the existing `RENDER_DEPLOYMENT.md` guide for backend deployment.

### 1.2 Set Backend Environment Variables in Render

Add these environment variables in your Render service dashboard:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | production |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/liftmate` |
| `JWT_SECRET` | Strong random string | `abc123...` (min 32 chars) |
| `FRONTEND_URL` | Your Vercel URL | `https://your-app.vercel.app` |
| `PORT` | (Render sets this) | Leave empty |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` (optional) |
| `MPESA_SHORTCODE` | M-Pesa shortcode | `174379` (optional) |
| `MPESA_CONSUMER_KEY` | M-Pesa consumer key | `your_key` (optional) |
| `MPESA_CONSUMER_SECRET` | M-Pesa consumer secret | `your_secret` (optional) |
| `MPESA_PASSKEY` | M-Pesa passkey | `your_passkey` (optional) |
| `MPESA_ENV` | Environment | `sandbox` (optional) |

**Important**: Add your Vercel URL to `FRONTEND_URL` for CORS support.

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Deploy Frontend to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the frontend folder

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.2 Set Frontend Environment Variables in Vercel

Add these environment variables in your Vercel project dashboard:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://your-backend.onrender.com/api` |
| `VITE_APP_NAME` | App name | `LiftMate` |

**Note**: Environment variables in Vercel should start with `VITE_` to be accessible in the frontend.

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update CORS Configuration

Your backend CORS has been updated to allow your Vercel domain. The `FRONTEND_URL` environment variable allows the backend to accept requests from your Vercel app.

### 3.2 API URL Configuration

The frontend automatically uses the `VITE_API_URL` environment variable to connect to your backend:

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend.onrender.com/api`

### 3.3 Update M-Pesa Callback URL (Optional)

If using M-Pesa payments:

1. After deploying backend, copy your Render URL: `https://your-backend.onrender.com`
2. Update in Render dashboard:
   - `MPESA_CALLBACK_URL`: `https://your-backend.onrender.com/api/payment/callback`
3. Restart your Render service

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend Health
Visit: `https://your-backend.onrender.com/api/auth/test`
Should return: `{"status":"OK","message":"LiftMate Backend is running","timestamp":"..."}`

### 4.2 Test Frontend
Visit: `https://your-app.vercel.app`
- Check browser console for any API errors
- Test login/registration functionality

### 4.3 Test API Connection
1. Open browser developer tools
2. Go to Network tab
3. Try logging in - you should see requests to `https://your-backend.onrender.com/api/auth/login`

## 🔧 Step 5: Environment Variables Summary

### Backend (Render) Variables:
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key
FRONTEND_URL=https://your-app.vercel.app
PORT= (Render sets this)
# Optional payment variables
STRIPE_SECRET_KEY=sk_test_...
MPESA_SHORTCODE=174379
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_ENV=sandbox
```

### Frontend (Vercel) Variables:
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=LiftMate
```

## 🚨 Troubleshooting

### Common Issues:

#### 1. **CORS Errors**
```
Access to fetch at 'https://your-backend.onrender.com/api/auth/login' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```
**Solution**: 
- Ensure `FRONTEND_URL` is set in Render dashboard
- Add your Vercel domain to allowed origins in backend CORS

#### 2. **API Connection Failed**
```
Failed to fetch
Network Error
```
**Solutions**:
- Check `VITE_API_URL` in Vercel dashboard matches your Render URL
- Ensure backend is deployed and healthy
- Verify no typos in URLs

#### 3. **Environment Variables Not Working**
**Solutions**:
- Restart services after adding environment variables
- Ensure frontend variables start with `VITE_`
- Check Vercel/Render dashboard for correct values

#### 4. **Build Failures**
**Frontend (Vercel)**:
- Check build logs in Vercel dashboard
- Ensure Node.js dependencies are compatible
- Verify build command: `npm run build`

**Backend (Render)**:
- Check build logs in Render dashboard  
- Ensure `npm install` works correctly
- Verify port configuration

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Restrict to your specific domains (not `*`)
3. **HTTPS**: Both Vercel and Render provide HTTPS automatically
4. **JWT Secret**: Use strong, randomly generated secrets
5. **Database**: Use MongoDB Atlas network restrictions

## 📱 Testing Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] API requests show in browser network tab
- [ ] No CORS errors in console
- [ ] Payment integration (if configured) works

## 🌟 Production Tips

1. **Domain Names**: Consider custom domains for both frontend and backend
2. **Monitoring**: Set up uptime monitoring for both services
3. **Backups**: Regular MongoDB Atlas backups
4. **SSL**: Automatic HTTPS on both platforms
5. **CDN**: Vercel provides global CDN automatically
6. **Scaling**: Both platforms auto-scale under load

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs in Vercel/Render dashboards
3. Test API endpoints directly with Postman
4. Verify all environment variables are set correctly

Your LiftMate app is now deployed with a scalable, production-ready architecture! 🎉