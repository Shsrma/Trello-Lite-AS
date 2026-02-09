// backend/src/services/socket.service.js
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
  } catch (error) {
    logger.error('Socket emit error:', error);
  }
};

const emitToProject = (projectId, event, data) => {
  try {
    const io = getIO();
    io.to(`project:${projectId}`).emit(event, data);
  } catch (error) {
    logger.error('Socket emit error:', error);
  }
};

const emitToAll = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (error) {
    logger.error('Socket emit error:', error);
  }
};

module.exports = {
  emitToUser,
  emitToProject,
  emitToAll,
};
