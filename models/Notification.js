const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'fleet_manager', 'dealer', 'franchise_owner', 'service_manager', 'all'],
      default: 'all',
      index: true,
    },
    module: {
      type: String,
      enum: ['landing', 'auth', 'charging', 'fleet', 'dealership', 'franchise', 'admin', 'cafe', 'service', 'gps', 'reports', 'trip', 'token'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
