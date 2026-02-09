// backend/src/services/notification.service.js
const Notification = require('../models/Notification.model');
const AppError = require('../utils/AppError');
const socketService = require('./socket.service');
const mailService = require('./mail.service');

const createNotification = async (notificationData) => {
  const notification = await Notification.create(notificationData);

  const populatedNotification = await Notification.findById(notification._id)
    .populate('sender', 'name email')
    .populate('recipient', 'name email')
    .populate('relatedTask', 'title')
    .populate('relatedProject', 'name');

  socketService.emitToUser(notificationData.recipient, 'notification:new', populatedNotification);

  await mailService.sendNotificationEmail(populatedNotification);

  return populatedNotification;
};

const getNotifications = async (userId, query = {}) => {
  const { isRead, limit = 50, skip = 0 } = query;

  const filter = { recipient: userId };
  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }

  const notifications = await Notification.find(filter)
    .populate('sender', 'name email')
    .populate('relatedTask', 'title')
    .populate('relatedProject', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  return {
    notifications,
    total,
    unreadCount,
  };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await Notification.findByIdAndDelete(notificationId);
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
