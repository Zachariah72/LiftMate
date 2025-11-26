const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, gender, carRegNumber, carMake, carModel, carColor } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with that email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role, gender, carRegNumber, carMake, carModel, carColor });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Registration error", error });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Login error", error });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        user.resetToken = resetToken;
        await user.save();

        // In a real app, send email with token
        console.log(`Reset token for ${email}: ${resetToken}`);
        res.json({ message: "Reset token generated. Check console for token." });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.resetToken !== token) return res.status(400).json({ message: "Invalid token" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetToken = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
});

router.patch('/location', verifyToken, async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.location.coordinates = [longitude, latitude];
        await user.save();
        res.json({ message: 'Location updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
});

// Update user location
router.post('/location', verifyToken, async (req, res) => {
  const { lat, lon } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { location: { type: 'Point', coordinates: [lon, lat] } });
    res.json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
});

module.exports = router;
