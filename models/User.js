// User model that supports JWT authentication and role-based access control.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(String(value || '').trim().toLowerCase()),
        message: 'Please provide a valid email address',
      },
    },
    mobile: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
      validate: {
        validator: (value) => !value || /^\d{10}$/.test(String(value).replace(/\D/g, '')),
        message: 'Mobile must be a valid 10-digit number',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'fleet_manager', 'dealer', 'franchise_owner', 'service_manager'],
      default: 'user',
    },
    profileImage: {
      type: String,
      trim: true,
      default: null,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('validate', function normalizeNames(next) {
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }

  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (this.mobile) {
    this.mobile = String(this.mobile).replace(/\D/g, '').slice(-10);
  }

  next();
});

// Hash passwords only when the password field is new or changed.
userSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare a plaintext password with the stored hash during login.
userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);