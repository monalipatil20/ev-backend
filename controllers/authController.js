// Authentication controller for registering users, logging them in, and returning profile data.
const crypto = require('crypto');
const User = require('../models/User');
const AuthOtp = require('../models/AuthOtp');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/token');

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isValidEmail = (email) => EMAIL_REGEX.test(normalizeEmail(email));

const sanitizeUser = (user) => ({
  id: user?._id,
  fullName: user?.fullName || user?.name,
  name: user?.name,
  email: user?.email,
  mobile: user?.mobile,
  role: user?.role,
  profileImage: user?.profileImage,
  createdAt: user?.createdAt,
  updatedAt: user?.updatedAt,
});

const allowedRoles = ['user', 'admin', 'fleet_manager', 'dealer', 'franchise_owner', 'service_manager'];

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const registerUser = async (req, res, next) => {
  try {
    const { fullName, name, email, mobile, password, role, profileImage } = req.body;
    const displayName = fullName || name;
    const normalizedEmail = normalizeEmail(email);

    if (!displayName || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required', 'MISSING_FIELDS');
    }

    if (!isValidEmail(normalizedEmail)) {
      throw new ApiError(400, 'Please enter a valid email address', 'INVALID_EMAIL');
    }

    if (mobile && !/^\d{10}$/.test(String(mobile).replace(/\D/g, ''))) {
      throw new ApiError(400, 'Please enter a valid 10-digit mobile number', 'INVALID_MOBILE');
    }

    const normalizedRole = role && allowedRoles.includes(role) ? role : 'user';

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, 'Email already exists', 'USER_EXISTS');
    }

    const user = await User.create({
      fullName: displayName,
      name: displayName,
      email: normalizedEmail,
      mobile: mobile || '0000000000',
      password,
      role: normalizedRole,
      profileImage,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user),
      data: sanitizeUser(user),
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return next(new ApiError(409, 'Email already exists', 'USER_EXISTS'));
    }
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required', 'MISSING_FIELDS');
    }

    if (!isValidEmail(normalizedEmail)) {
      throw new ApiError(400, 'Please enter a valid email address', 'INVALID_EMAIL');
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'This account is inactive', 'ACCOUNT_INACTIVE');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user),
      data: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated', 'UNAUTHENTICATED');
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: sanitizeUser(req.user),
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    return next(error);
  }
};

const requestOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    const normalizedPurpose = purpose === 'registration' ? 'registration' : 'forgot-password';

    if (!email) {
      throw new ApiError(400, 'Email is required', 'MISSING_FIELDS');
    }

    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await AuthOtp.create({
      email: email.toLowerCase(),
      otp,
      purpose: normalizedPurpose,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        email: email.toLowerCase(),
        purpose: normalizedPurpose,
        otp,
        expiresAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;
    if (!email || !otp) {
      throw new ApiError(400, 'Email and OTP are required', 'MISSING_FIELDS');
    }

    const otpRecord = await AuthOtp.findOne({
      email: email.toLowerCase(),
      otp: String(otp),
      purpose: purpose === 'registration' ? 'registration' : 'forgot-password',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new ApiError(400, 'Invalid or expired OTP', 'INVALID_OTP');
    }

    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        email: otpRecord.email,
        purpose: otpRecord.purpose,
        verifiedAt: otpRecord.verifiedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, 'Email is required', 'MISSING_FIELDS');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken +passwordResetExpiresAt');
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully',
      data: {
        email: user.email,
        resetToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      throw new ApiError(400, 'token and password are required', 'MISSING_FIELDS');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpiresAt');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token', 'INVALID_RESET_TOKEN');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token: generateToken(user),
      data: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
};