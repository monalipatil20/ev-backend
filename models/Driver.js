const mongoose = require('mongoose');

const kycDocumentSchema = new mongoose.Schema(
  {
    aadhaarCard: { type: String, default: null },
    drivingLicense: { type: String, default: null },
    profilePhoto: { type: String, default: null },
    bankProof: { type: String, default: null },
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fleet',
      default: null,
      index: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      validate: {
        validator: (value) => /^\d{10}$/.test(String(value).replace(/\D/g, '')),
        message: 'Invalid mobile number',
      },
      index: true,
    },
    aadhaar: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      index: true,
    },
    license: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    bankDetails: {
      type: String,
      required: [true, 'Bank details are required'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency contact is required'],
      trim: true,
    },
    shift: {
      type: String,
      enum: ['Morning shift', 'Evening shift', 'Night shift'],
      default: null,
    },
    shiftDuration: {
      type: String,
      enum: ['6 hour shift', '8 hour shift'],
      default: null,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'in-review', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['not-started', 'under-review', 'verified'],
      default: 'not-started',
    },
    kycDocuments: {
      type: kycDocumentSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

driverSchema.pre('validate', function normalize(next) {
  this.mobileNumber = String(this.mobileNumber || '').replace(/\D/g, '').slice(-10);
  this.aadhaar = String(this.aadhaar || '').replace(/\D/g, '');
  this.license = String(this.license || '').toUpperCase().trim();
  next();
});

module.exports = mongoose.model('Driver', driverSchema);
