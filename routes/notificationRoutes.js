const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, notificationController.getNotifications);
router.post('/', protect, authorizeRoles('admin'), notificationController.createNotification);
router.put('/:id/read', protect, notificationController.markNotificationRead);

module.exports = router;
