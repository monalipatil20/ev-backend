const mongoose = require('mongoose');

const chargingSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: [true, 'Station name is required'],
    },
    location: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number,
    totalConnectors: {
      type: Number,
      required: true,
    },
    availableConnectors: Number,
    connectorTypes: [String],
    pricePerUnit: {
      type: Number,
      required: true,
    },
    operatingHours: String,
    amenities: [String],
    parkingAvailable: Boolean,
    restaurantNearby: Boolean,
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChargingStation', chargingSchema);
