// Cafe order model for storing customer orders and payment state.
const mongoose = require('mongoose');

const cafeOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    items: {
      type: [
        {
          itemName: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
          },
          quantity: {
            type: Number,
            required: [true, 'Item quantity is required'],
            min: [1, 'Item quantity must be at least 1'],
            default: 1,
          },
          price: {
            type: Number,
            required: [true, 'Item price is required'],
            min: [0, 'Item price cannot be negative'],
            default: 0,
          },
        },
      ],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one item is required',
      },
      required: [true, 'Items are required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'placed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CafeOrder', cafeOrderSchema);