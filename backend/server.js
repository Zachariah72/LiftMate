const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const authDebugRoutes = require('./routes/auth_debug'); // Add debug routes
const rideRoutes = require('./routes/rides'); // <-- Added rides routes
const paymentRoutes = require('./routes/payment');

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:5173',
      'http://192.168.100.25:5173', // Local network IP
      // Production Vercel domain
      'https://lift-mate.vercel.app',
      'https://lift-mate-zeta.vercel.app', // Updated production frontend
      'https://lift-mate-clip6auu6-zachariahs-projects-c4361150.vercel.app', // Actual deployed frontend
      // Backend domain for health checks
      'https://liftmate-46f4.onrender.com',
      'https://liftmate-1.onrender.com', // Updated production backend
      // Environment variable fallback
      process.env.FRONTEND_URL || 'https://lift-mate-zeta.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Full error:', err);
  // Continue running the server even if MongoDB fails
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth-debug', authDebugRoutes); // Add debug routes
app.use('/api/rides', rideRoutes); // <-- Mount ride routes
app.use('/api/payment', paymentRoutes); // <-- Mount payment routes

// Health check endpoint for Render
app.get('/api/auth/test', (req, res) => {
  res.json({ status: 'OK', message: 'LiftMate Backend is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
