# LiftMate Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Frontend Deployment to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository: `Zachariah72/LiftMate`

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables** (Add these in Vercel dashboard):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=LiftMate
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
   ```

4. **Deploy**: Click "Deploy" 🎉

### Backend Deployment to Render

1. **Deploy Backend** (follow the detailed guide in `backend/RENDER_DEPLOYMENT.md`)

2. **Get Backend URL**: After deployment, note your Render URL (e.g., `https://liftmate-backend.onrender.com`)

3. **Update Frontend Environment**:
   - In Vercel dashboard, update `VITE_API_URL` to: `https://your-backend-url.onrender.com/api`

## 🔧 Project Structure

```
LiftMate/
├── frontend/                 # React + Vite app
│   ├── .env.production      # Production environment variables
│   ├── vercel.json          # Vercel configuration
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js + Express API
│   ├── render.yaml          # Render deployment config
│   ├── .env                 # Backend environment variables
│   └── server.js            # Express server
└── README.md
```

## ✅ Pre-Deployment Checklist

### Frontend Requirements:
- [ ] Update `VITE_API_URL` in `.env.production`
- [ ] Add Stripe publishable key (test mode is fine)
- [ ] Configure Google Maps API key (optional)
- [ ] Test build locally: `cd frontend && npm run build`

### Backend Requirements:
- [ ] Set up MongoDB Atlas account and cluster
- [ ] Get MongoDB connection string
- [ ] Configure Stripe secret key
- [ ] Set up M-Pesa credentials (optional for now)
- [ ] Generate JWT secret

### Environment Variables:

**Frontend (Vercel)**:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=LiftMate
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=...
```

**Backend (Render)**:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_...
MPESA_SHORTCODE=...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_ENV=sandbox
```

## 🌐 Post-Deployment Testing

1. **Frontend Test**:
   - Visit your Vercel URL
   - Check homepage loads correctly
   - Test registration/login forms
   - Verify API calls work

2. **Backend Test**:
   - Visit: `https://your-backend.onrender.com/api/auth/test`
   - Should return: `{"status":"OK","message":"LiftMate Backend is running"}`

3. **Integration Test**:
   - Register a new user through the frontend
   - Check if user appears in MongoDB Atlas
   - Test login functionality

## 🔗 URL Structure

After deployment:
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-backend-name.onrender.com`
- **API Base**: `https://your-backend-name.onrender.com/api`

## 🛠️ Troubleshooting

### Common Issues:

1. **Frontend shows "Network Error"**:
   - Check `VITE_API_URL` environment variable
   - Verify backend is running on Render
   - Check browser console for CORS errors

2. **Registration fails with 500 error**:
   - Check backend logs in Render dashboard
   - Verify MongoDB connection string
   - Ensure all required environment variables are set

3. **Build fails on Vercel**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Ensure build command is correct

## 🎯 Features Ready for Production

✅ User authentication (register/login)
✅ JWT token management
✅ Ride booking system
✅ Driver dashboard
✅ Payment integration (Stripe + M-Pesa)
✅ Responsive design
✅ Real-time features
✅ Database operations

## 📱 Mobile-Ready

The app is fully responsive and works great on:
- Desktop browsers
- Mobile browsers
- Tablets
- Progressive Web App (PWA) capable

## 🚀 Ready to Launch!

Your LiftMate app is production-ready with:
- Scalable architecture
- Secure authentication
- Payment processing
- Real-time updates
- Mobile optimization
- Cloud deployment

Deploy confidently! 🎉