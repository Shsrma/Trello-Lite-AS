// backend/src/models/Task.model.js
const mongoose = require('mongoose');
const { TASK_STATUS } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ project: 1, status: 1, order: 1 });
taskSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Task', taskSchema);
