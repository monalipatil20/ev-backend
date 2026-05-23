const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
