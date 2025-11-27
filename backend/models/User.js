const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, enum: ['driver', 'rider'], default: 'rider' },
    resetToken: { type: String },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, required: true },
    carRegNumber: { type: String },
    carMake: { type: String },
    carModel: { type: String },
    carColor: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    isAvailable: { type: Boolean, default: true },
    nickname: { type: String },
    profilePicture: { type: String },
    isVerified: { type: Boolean, default: false },
    kycDocuments: {
      idDocument: { type: String },
      passport: { type: String },
      driversLicense: { type: String }
    }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
