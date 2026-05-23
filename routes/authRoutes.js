// Authentication routes for registration, login, and session lookup.
const express = require('express');

const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getCurrentUser);

module.exports = router;