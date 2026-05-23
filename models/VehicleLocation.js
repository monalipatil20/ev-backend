// Vehicle location model for storing live and historical GPS coordinates.
const mongoose = require('mongoose');

const vehicleLocationSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: [true, 'vehicleId is required'],
      trim: true,
      minlength: [2, 'vehicleId must be at least 2 characters long'],
      maxlength: [100, 'vehicleId cannot exceed 100 characters'],
      index: true,
    },
    driverId: {
      type: String,
      required: [true, 'driverId is required'],
      trim: true,
      minlength: [2, 'driverId must be at least 2 characters long'],
      maxlength: [100, 'driverId cannot exceed 100 characters'],
    },
    latitude: {
      type: Number,
      required: [true, 'latitude is required'],
      min: [-90, 'latitude must be between -90 and 90'],
      max: [90, 'latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'longitude is required'],
      min: [-180, 'longitude must be between -180 and 180'],
      max: [180, 'longitude must be between -180 and 180'],
    },
    timestamp: {
      type: Date,
      required: [true, 'timestamp is required'],
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleLocationSchema.index({ vehicleId: 1, timestamp: -1 });

module.exports = mongoose.model('VehicleLocation', vehicleLocationSchema);
