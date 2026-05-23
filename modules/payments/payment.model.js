const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paymentType: {
      type: String,
      enum: ['vehicle-booking', 'charging', 'service', 'subscription'],
      required: true,
    },
    referenceId: String,
    orderDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    receiptUrl: String,
    invoiceNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
