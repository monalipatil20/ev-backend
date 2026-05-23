const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const { emitAdminNotification } = require('../socket/gpsSocket');

const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    emitAdminNotification({ event: 'created', data: notification });
    return res.status(201).json({ success: true, message: 'Notification created successfully', data: notification });
  } catch (error) {
    return next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user) {
      filter.$or = [
        { userId: req.user._id },
        { role: req.user.role },
        { role: 'all' },
      ];
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Notifications fetched successfully', data: notifications });
  } catch (error) {
    return next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
};
