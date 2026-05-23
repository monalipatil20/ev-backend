const mongoose = require('mongoose');

const tokenTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    tokens: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      enum: ['charging', 'trip', 'cafe', 'fleet', 'admin', 'manual'],
      default: 'manual',
    },
    referenceId: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

tokenTransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TokenTransaction', tokenTransactionSchema);
