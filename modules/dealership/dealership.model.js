const mongoose = require('mongoose');

const dealershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
    },
    dealershipType: {
      type: String,
      enum: ['dealer', 'franchise'],
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    licensingNumber: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    totalInventory: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    documentsUploaded: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Dealership', dealershipSchema);
