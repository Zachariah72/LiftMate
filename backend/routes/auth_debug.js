const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Test endpoint - Register a user and immediately return token info
router.post('/register-debug', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with that email already exists" });
        }

        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // Return detailed debug info
        res.json({ 
            success: true,
            message: 'User registered with debug info',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: token,
            tokenLength: token.length,
            jwtSecretSet: !!process.env.JWT_SECRET,
            jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
            tokenPreview: token.substring(0, 20) + '...',
            decodedToken: jwt.decode(token)
        });
    } catch (error) {
        console.error('Registration debug error:', error);
        res.status(500).json({ 
            message: "Registration error", 
            error: error.message,
            jwtSecretSet: !!process.env.JWT_SECRET,
            jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
        });
    }
});

// Test endpoint - Verify a token and return decoded info
router.post('/verify-debug', async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.json({
            success: true,
            message: 'Token is valid',
            decoded: decoded,
            jwtSecretSet: !!process.env.JWT_SECRET,
            jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
        });
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(400).json({
            success: false,
            message: 'Token verification failed',
            error: err.message,
            jwtSecretSet: !!process.env.JWT_SECRET,
            jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
            tokenProvided: !!token,
            tokenLength: token ? token.length : 0
        });
    }
});

// Environment test endpoint
router.get('/env-debug', (req, res) => {
    res.json({
        jwtSecretSet: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
        jwtSecretPreview: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : 'Not set',
        nodeEnv: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL,
        mongoUriSet: !!process.env.MONGO_URI
    });
});

module.exports = router;