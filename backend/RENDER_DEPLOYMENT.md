# LiftMate Backend Deployment Guide for Render

This guide will help you deploy your LiftMate backend application to Render.com.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
3. **MongoDB Atlas Account**: For database hosting (free tier available)
4. **Required API Keys**: 
   - Stripe account for payments (test mode is fine for development)
   - M-Pesa developer account (Safaricom) for payment processing

## Step 1: Prepare Your Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new project

2. **Set up a Cluster**:
   - Choose the free tier (M0)
   - Select a region closest to your users
   - Create cluster

3. **Configure Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these)
   - Give the user "Atlas admin" role

4. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - For production, add Render's IP ranges

5. **Get Connection String**:
   - Go back to your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 2: Prepare API Keys

### Stripe Setup:
1. Create account at [Stripe](https://stripe.com)
2. Go to Developers → API Keys
3. Copy the "Secret key" (starts with `sk_test_` for test mode)

### M-Pesa Setup (Safaricom):
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app
3. Copy:
   - Consumer Key
   - Consumer Secret
   - Passkey (from your app settings)
   - Shortcode (for STK Push)

## Step 3: Deploy to Render

### Option A: Automatic Deployment via GitHub

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**:
   - Log in to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account and select your repository

3. **Configure Service**:
   - **Name**: `liftmate-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: Leave empty (since we're deploying from root)
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### Option B: Manual Deployment

1. **Install Render CLI**:
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**:
   ```bash
   render login
   ```

3. **Deploy**:
   ```bash
   render deploy
   ```

## Step 4: Configure Environment Variables

After creating the service, you need to set up environment variables:

1. **Go to your service dashboard** on Render
2. **Click "Environment" tab**
3. **Add these environment variables**:

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `NODE_ENV` | `production` | Environment mode |
   | `PORT` | (leave empty - Render will set this) | Server port |
   | `MONGO_URI` | Your MongoDB Atlas connection string | Database connection |
   | `JWT_SECRET` | A strong random string (min 32 chars) | JWT token signing |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key | Payment processing |
   | `MPESA_SHORTCODE` | Your M-Pesa shortcode | M-Pesa configuration |
   | `MPESA_CONSUMER_KEY` | Your M-Pesa consumer key | M-Pesa authentication |
   | `MPESA_CONSUMER_SECRET` | Your M-Pesa consumer secret | M-Pesa authentication |
   | `MPESA_PASSKEY` | Your M-Pesa passkey | M-Pesa authentication |
   | `MPESA_ENV` | `sandbox` or `production` | M-Pesa environment |
   | `MPESA_CALLBACK_URL` | `https://your-app-name.onrender.com/api/payment/callback` | Payment callback URL |

### Generate JWT Secret:
You can generate a secure JWT secret using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 5: Update M-Pesa Callback URL

1. After deployment, copy your Render app URL (e.g., `https://liftmate-backend.onrender.com`)
2. Update the `MPESA_CALLBACK_URL` environment variable to:
   ```
   https://your-app-name.onrender.com/api/payment/callback
   ```
3. If using M-Pesa sandbox, also update this URL in your Safaricom app settings

## Step 6: Test Your Deployment

1. **Check Health Endpoint**:
   Visit: `https://your-app-name.onrender.com/api/auth/test`
   You should see: `{"status":"OK","message":"LiftMate Backend is running","timestamp":"..."}`

2. **Test API Endpoints**:
   - Registration: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Get rides: `GET /api/rides`
   - M-Pesa payment: `POST /api/payment/mpesa`

3. **Check Logs**:
   - In your Render dashboard, go to "Logs" tab
   - You should see "Server running on port {PORT}" and "MongoDB connected"

## Step 7: Connect Frontend

Update your frontend API configuration to point to your Render backend:

1. **Update frontend API base URL**:
   ```javascript
   // In your frontend/api/axios.js or similar
   const API_BASE_URL = 'https://your-app-name.onrender.com';
   ```

2. **Update CORS settings** (if needed):
   The backend is already configured to accept requests from any origin, but you can restrict it in `server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'http://localhost:3000']
   }));
   ```

## Troubleshooting

### Common Issues:

1. **"Cannot connect to MongoDB"**:
   - Check your `MONGO_URI` format
   - Ensure IP access is configured in MongoDB Atlas
   - Verify database user credentials

2. **"JWT_SECRET is not defined"**:
   - Make sure all environment variables are set
   - Check for typos in variable names

3. **"Neither apiKey nor config.authenticator provided" (Stripe error)**:
   - Set the `STRIPE_SECRET_KEY` environment variable in Render
   - Ensure the key starts with `sk_test_` or `sk_live_`
   - If you don't need Stripe immediately, you can deploy without it and add the key later

4. **M-Pesa not working**:
   - Verify all M-Pesa environment variables
   - Check if `MPESA_CALLBACK_URL` matches your actual URL
   - Ensure you're using the correct M-Pesa environment (sandbox/production)
   - The app will now show helpful error messages if M-Pesa is not configured

5. **Build fails**:
   - Check the build logs in Render dashboard
   - Ensure your `package.json` scripts are correct
   - Verify all dependencies are properly defined

6. **Environment variables not loading**:
   - Make sure to set environment variables in Render dashboard, not in `.env` files
   - Restart your service after adding new environment variables

### Logs Location:
- Render Dashboard → Your Service → "Logs" tab

### Useful Commands:

1. **Test locally**:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Edit this with your values
   npm start
   ```

2. **Check environment variables locally**:
   ```bash
   node -e "console.log(process.env.MONGO_URI)"
   ```

## Cost Optimization

- **Free Tier**: Render's free tier has limitations (service sleeps after 15 minutes of inactivity)
- **Paid Plan**: For production use, consider the $7/month "Starter" plan for always-on service
- **Database**: MongoDB Atlas free tier is sufficient for development and small applications

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, randomly generated secret
3. **CORS**: Restrict origins in production
4. **Rate Limiting**: Consider adding rate limiting for API endpoints
5. **HTTPS**: Render provides HTTPS automatically
6. **Database**: Use MongoDB Atlas network access restrictions in production
7. **Graceful Error Handling**: The app now handles missing API keys gracefully instead of crashing on startup
8. **Optional Payment Providers**: M-Pesa and Stripe features are optional - the app runs without them but shows helpful error messages when payment features are accessed

## Next Steps

After successful deployment:

1. **Set up monitoring** (optional)
2. **Configure custom domain** (optional)
3. **Set up CI/CD pipeline** (Render does this automatically)
4. **Configure alerts** for service downtime
5. **Test all payment flows** thoroughly

Your LiftMate backend is now live on Render! 🚀