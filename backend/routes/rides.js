// backend/routes/rides.js
const express = require('express');
const mongoose = require('mongoose');
const Ride = require('../models/Ride');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { stkPush } = require('../mpesa');

const router = express.Router();

// Create a ride request
router.post('/create', verifyToken, async (req, res) => {
  const { pickupLocation, dropoffLocation, fare } = req.body;
  if (!pickupLocation || !dropoffLocation || !fare) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const ride = new Ride({
      passenger: req.user.id,
      pickupLocation,
      dropoffLocation,
      fare,
      status: 'requested'
    });
    await ride.save();
    res.json({ message: 'Ride requested', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride', error });
  }
});

// Pay for a ride via M-Pesa STK Push
router.post('/pay', verifyToken, async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ message: 'Phone and amount are required' });
  }

  try {
    const response = await stkPush(phone, amount);
    res.json({ message: 'STK Push initiated', response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment failed', err });
  }
});

// Get all rides for the authenticated user (rider)
router.get('/', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ passenger: req.user.id }).populate('driver', 'name email carRegNumber carMake carModel carColor');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error });
  }
});

// Get ride by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name email carRegNumber carMake carModel carColor').populate('passenger', 'name email');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ride', error });
  }
});

// Get available rides for drivers
router.get('/available/for-drivers', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('passenger', 'name email');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rides', error });
  }
});

// Get available rides for drivers
router.get('/available', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('passenger', 'name email');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rides', error });
  }
});

// Get available drivers
router.get('/available-drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', isAvailable: true }).select('name location');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available drivers', error });
  }
});

// Update ride status (driver accepts/completes)
router.patch('/:id', verifyToken, async (req, res) => {
  const { status, driver } = req.body;
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (status) ride.status = status;
    if (driver) ride.driver = driver;

    await ride.save();
    res.json({ message: 'Ride updated', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ride', error });
  }
});

// Rate a ride
router.patch('/:id/rate', verifyToken, async (req, res) => {
  const { rating, review } = req.body;
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.passenger.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    ride.rating = rating;
    ride.review = review;
    await ride.save();
    res.json({ message: 'Ride rated', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error rating ride', error });
  }
});

// Accept ride
router.post('/accept/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'requested') return res.status(400).json({ message: 'Ride not available' });

    ride.status = 'accepted';
    ride.driver = req.user.id;
    await ride.save();
    res.json({ message: 'Ride accepted', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting ride', error });
  }
});

// Mark driver arrived
router.post('/arrive/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Only driver can mark arrived
    if (ride.driver?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ride.driverArrived = true;
    await ride.save();

    res.json({ message: 'Driver arrived', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error marking arrival', error });
  }
});

// Complete ride
router.post('/complete/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Allow passenger or driver to complete
    if (ride.passenger.toString() !== req.user.id && ride.driver?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ride.status = 'completed';
    await ride.save();

    // Make driver available again
    if (ride.driver) {
      await User.findByIdAndUpdate(ride.driver, { isAvailable: true });
    }

    res.json({ message: 'Ride completed', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error completing ride', error });
  }
});

// Accept ride (driver)
router.post('/:id/accept', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.status !== 'requested') return res.status(400).json({ message: 'Ride not available' });

    ride.status = 'accepted';
    ride.driver = req.user.id;
    await ride.save();

    res.json({ message: 'Ride accepted', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting ride', error });
  }
});

// Complete ride (driver)
router.post('/:id/complete', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.driver.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    ride.status = 'completed';
    await ride.save();

    res.json({ message: 'Ride completed', ride });
  } catch (error) {
    res.status(500).json({ message: 'Error completing ride', error });
  }
});

// Get driver stats
router.get('/driver-stats', verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    const driverId = req.user.id;
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

    const [total, today, week, month, year] = await Promise.all([
      Ride.countDocuments({ driver: driverId, status: 'completed' }),
      Ride.countDocuments({ driver: driverId, status: 'completed', updatedAt: { $gte: startOfDay } }),
      Ride.countDocuments({ driver: driverId, status: 'completed', updatedAt: { $gte: startOfWeek } }),
      Ride.countDocuments({ driver: driverId, status: 'completed', updatedAt: { $gte: startOfMonth } }),
      Ride.countDocuments({ driver: driverId, status: 'completed', updatedAt: { $gte: startOfYear } })
    ]);

    const earnings = await Ride.aggregate([
      { $match: { driver: driverId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare' } } }
    ]);

    res.json({
      ordersReceived: { total, today, week, month, year },
      earnings: earnings[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
