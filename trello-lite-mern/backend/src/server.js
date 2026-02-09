// backend/src/server.js
const app = require('./app');
const connectDB = require('./config/db');
const { initializeSocket } = require('./config/socket');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    initializeSocket(server);

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
