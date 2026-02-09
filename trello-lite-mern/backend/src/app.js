// backend/src/app.js
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const corsConfig = require('./config/cors');
const errorMiddleware = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const notificationRoutes = require('./routes/notification.routes');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(corsConfig);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

module.exports = app;
