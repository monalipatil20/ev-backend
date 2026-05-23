// Vehicle model for EV showroom inventory.
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    batteryRange: {
      type: Number,
      required: [true, 'Battery range is required'],
      min: [0, 'Battery range cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);