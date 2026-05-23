// Fleet model for managing EV vehicles assigned to fleet operations.
const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      index: true,
      default: null,
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    batteryStatus: {
      type: Number,
      required: [true, 'Battery status is required'],
      min: [0, 'Battery status cannot be below 0'],
      max: [100, 'Battery status cannot exceed 100'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    driverName: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    driverIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Driver',
        },
      ],
      default: [],
    },
    fleetManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'charging'],
      default: 'active',
    },
    vehicleKyc: {
      rcBook: { type: String, default: null },
      insurance: { type: String, default: null },
      pollutionCertificate: { type: String, default: null },
      vehicleImage: { type: String, default: null },
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'in-review', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    shifts: {
      type: [
        {
          shift: {
            type: String,
            enum: ['Morning shift', 'Evening shift', 'Night shift'],
            required: true,
          },
          driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
          },
          duration: {
            type: String,
            enum: ['6 hour shift', '8 hour shift'],
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

fleetSchema.index({ coordinates: '2dsphere' });

fleetSchema.pre('save', function normalize(next) {
  if (!this.vehicleId) {
    this.vehicleId = `EV-${String(this._id).slice(-6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Fleet', fleetSchema);