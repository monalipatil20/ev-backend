// Charging station model for EV station inventory and availability management.
const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      min: [-90, 'latitude must be between -90 and 90'],
      max: [90, 'latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'longitude must be between -180 and 180'],
      max: [180, 'longitude must be between -180 and 180'],
    },
    chargerType: {
      type: String,
      required: [true, 'Charger type is required'],
      trim: true,
    },
    chargingSpeed: {
      type: String,
      required: [true, 'Charging speed is required'],
      trim: true,
      default: 'AC',
    },
    totalConnectors: {
      type: Number,
      required: [true, 'Total connectors is required'],
      min: [0, 'Total connectors cannot be negative'],
      default: 0,
    },
    availableSlots: {
      type: Number,
      required: [true, 'Available slots is required'],
      min: [0, 'Available slots cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 4.5,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price per unit cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

chargingStationSchema.index({ location: '2dsphere' });

chargingStationSchema.pre('validate', function normalizeGeoPoint(next) {
  if (typeof this.latitude === 'number' && typeof this.longitude === 'number') {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }

  next();
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);