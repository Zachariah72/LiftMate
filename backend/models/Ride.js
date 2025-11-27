// backend/models/Ride.js
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  fare: { type: Number, required: true },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'completed', 'cancelled'],
    default: 'requested'
  },
  driverArrived: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  mpesaReceipt: { type: String },
  mpesaCheckoutRequestId: { type: String }
}, { timestamps: true }); // createdAt and updatedAt are automatically added

module.exports = mongoose.model('Ride', rideSchema);
