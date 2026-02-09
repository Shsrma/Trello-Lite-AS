// backend/src/routes/task.routes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
} = require('../validators/task.validator');

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/project/:projectId', taskController.getTasksByProject);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/reorder', validate(reorderTasksSchema), taskController.reorderTasks);

module.exports = router;
