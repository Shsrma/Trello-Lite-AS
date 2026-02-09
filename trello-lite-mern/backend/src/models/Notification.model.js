// backend/src/models/Notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['TASK_ASSIGNED', 'TASK_UPDATED', 'PROJECT_INVITE', 'TASK_COMMENT', 'MENTION'],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
