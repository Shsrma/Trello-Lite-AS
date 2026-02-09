// backend/src/sockets/notification.socket.js
const logger = require('../utils/logger');

const notificationSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('notification:mark-read', async (data) => {
      try {
        logger.info(`Notification ${data.notificationId} marked as read by user ${socket.userId}`);
      } catch (error) {
        logger.error('Socket notification error:', error);
      }
    });
  });
};

module.exports = notificationSocket;
