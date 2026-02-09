// backend/src/controllers/project.controller.js
const projectService = require('../services/project.service');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.user._id);

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user._id);

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user._id);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const project = await projectService.addMember(req.params.id, req.body, req.user._id);

    res.status(200).json({
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(req.params.id, req.params.userId, req.user._id);

    res.status(200).json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
