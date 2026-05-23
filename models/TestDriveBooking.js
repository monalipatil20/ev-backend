// Test drive booking model for showroom leads and appointments.
const mongoose = require('mongoose');

const testDriveBookingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'completed', 'cancelled'],
      default: 'requested',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TestDriveBooking', testDriveBookingSchema);