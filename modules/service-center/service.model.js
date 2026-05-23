const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    serviceCenterName: {
      type: String,
      required: [true, 'Service center name is required'],
    },
    vehicleRegNumber: {
      type: String,
      required: true,
    },
    vehicleModel: String,
    serviceType: {
      type: String,
      enum: ['regular', 'emergency', 'battery-check', 'maintenance'],
      required: true,
    },
    description: String,
    appointmentDate: {
      type: Date,
      required: true,
    },
    estimatedCost: Number,
    actualCost: Number,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    serviceCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCenter',
    },
    invoiceDoc: String,
    partsReplaced: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
