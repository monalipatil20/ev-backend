const mongoose = require('mongoose');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    return next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({ success: true, message: 'User profile fetched successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      name: req.body.name,
      mobile: req.body.mobile,
      profileImage: req.file ? `/uploads/${req.file.filename}` : req.body.profileImage,
    };

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');

    return res.status(200).json({ success: true, message: 'User profile updated successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid user ID', 'INVALID_ID');
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
};
