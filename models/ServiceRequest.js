// Service request model for tracking EV service bookings and issues.
const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    issue: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);