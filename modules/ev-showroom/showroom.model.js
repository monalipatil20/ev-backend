const mongoose = require('mongoose');

const showroomSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    batteryCapacity: {
      type: String,
      default: null,
    },
    range: {
      type: Number,
      default: null,
    },
    chargingTime: {
      type: String,
      default: null,
    },
    images: [String],
    description: String,
    color: String,
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'cvt'],
    },
    fuelType: {
      type: String,
      enum: ['electric', 'petrol', 'diesel', 'hybrid'],
    },
    mileage: Number,
    features: [String],
    availability: {
      type: Boolean,
      default: true,
    },
    dealershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealership',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Showroom', showroomSchema);
