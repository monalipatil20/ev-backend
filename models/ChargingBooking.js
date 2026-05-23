// Charging booking model for reserved slots against a charging station.
const mongoose = require('mongoose');

const chargingBookingSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChargingStation',
      required: [true, 'Station reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    slotsBooked: {
      type: Number,
      required: [true, 'Booked slot count is required'],
      min: [1, 'At least one slot must be booked'],
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChargingBooking', chargingBookingSchema);