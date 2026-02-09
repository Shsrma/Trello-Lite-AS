// backend/src/config/socket.js
const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);

    socket.join(`user:${socket.userId}`);

    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      logger.info(`User ${socket.userId} joined project ${projectId}`);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      logger.info(`User ${socket.userId} left project ${projectId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
