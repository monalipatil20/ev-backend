// Fleet model for managing EV vehicles assigned to fleet operations.
const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    batteryStatus: {
      type: Number,
      required: [true, 'Battery status is required'],
      min: [0, 'Battery status cannot be below 0'],
      max: [100, 'Battery status cannot exceed 100'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'charging'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fleet', fleetSchema);