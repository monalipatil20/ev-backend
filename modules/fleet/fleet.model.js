const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema(
  {
    fleetManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
    },
    gstNumber: {
      type: String,
      required: [true, 'GST number is required'],
    },
    totalVehicles: {
      type: Number,
      default: 0,
    },
    totalDrivers: {
      type: Number,
      default: 0,
    },
    registrationDoc: {
      type: String,
      default: null,
    },
    gstDoc: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fleet', fleetSchema);
