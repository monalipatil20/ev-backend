// Authentication routes for registration, login, and session lookup.
const express = require('express');

const {
	registerUser,
	loginUser,
	getCurrentUser,
	requestOtp,
	verifyOtp,
	forgotPassword,
	resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getCurrentUser);

module.exports = router;