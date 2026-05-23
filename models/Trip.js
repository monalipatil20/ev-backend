const mongoose = require('mongoose');

const geoPointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 2,
        message: 'Coordinates must contain [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fleet',
      required: true,
      index: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },
    pickupPoint: {
      type: geoPointSchema,
      default: null,
    },
    dropPoint: {
      type: geoPointSchema,
      default: null,
    },
    routeCoordinates: {
      type: [geoPointSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    fareAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    distanceKm: {
      type: Number,
      default: 0,
      min: 0,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

tripSchema.index({ pickupPoint: '2dsphere' });
tripSchema.index({ dropPoint: '2dsphere' });

module.exports = mongoose.model('Trip', tripSchema);
