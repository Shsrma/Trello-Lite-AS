// backend/src/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
