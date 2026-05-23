const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ['fleet', 'revenue', 'vehicles', 'drivers', 'charging', 'service'],
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
    },
    reportTitle: {
      type: String,
      required: true,
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    totalRecords: Number,
    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    fileUrl: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
