// backend/src/sockets/index.js
const notificationSocket = require('./notification.socket');

const initializeSockets = (io) => {
  notificationSocket(io);
};

module.exports = initializeSockets;
