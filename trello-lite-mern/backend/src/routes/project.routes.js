// backend/src/routes/project.routes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  removeMemberSchema,
} = require('../validators/project.validator');

router.use(authenticate);

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/members', validate(addMemberSchema), projectController.addMember);
router.delete('/:id/members/:userId', validate(removeMemberSchema), projectController.removeMember);

module.exports = router;
