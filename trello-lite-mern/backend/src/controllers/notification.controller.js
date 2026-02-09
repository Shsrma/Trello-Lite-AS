// backend/src/controllers/notification.controller.js
const notificationService = require('../services/notification.service');

const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.user._id, req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);

    res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user._id);

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
