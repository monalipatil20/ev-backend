const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, userController.getUserProfile);
router.put('/me', protect, upload.single('profileImage'), userController.updateUserProfile);
router.get('/', protect, adminOnly, userController.listUsers);
router.get('/:id', protect, adminOnly, userController.getUserById);

module.exports = router;
