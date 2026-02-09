// backend/src/controllers/task.controller.js
const taskService = require('../services/task.service');
const socketService = require('../services/socket.service');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);

    socketService.emitToProject(req.body.projectId, 'task:created', task);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId, req.user._id);

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user._id);

    socketService.emitToProject(task.project._id, 'task:updated', task);

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const reorderTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.reorderTasks(req.body.tasks, req.user._id);

    if (tasks.length > 0) {
      socketService.emitToProject(tasks[0].project, 'tasks:reordered', tasks);
    }

    res.status(200).json({
      message: 'Tasks reordered successfully',
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
};
