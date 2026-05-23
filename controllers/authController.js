// Authentication controller for registering users, logging them in, and returning profile data.
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/token');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required', 'MISSING_FIELDS');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      throw new ApiError(409, 'A user with this email already exists', 'USER_EXISTS');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required', 'MISSING_FIELDS');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};