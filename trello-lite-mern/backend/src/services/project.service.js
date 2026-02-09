const AppError = require('../utils/AppError');

// ... (existing imports)

// ...

const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { 'members.user': userId }],
    isActive: true,
  })
    .populate('owner', 'name email')
    .populate('members.user', 'name email role');

  if (!project) {
    throw new AppError('Project not found or access denied', 404);
  }

  return project;
};

const updateProject = async (projectId, updateData, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isActive: true,
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const isAdmin = project.members.some(
    (member) => member.user.toString() === userId.toString() && member.role === 'ADMIN'
  );

  if (!isAdmin && project.owner.toString() !== userId.toString()) {
    throw new AppError('Only admins can update project', 403);
  }

  Object.assign(project, updateData);
  await project.save();

  return await project.populate('owner members.user', 'name email role');
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
    isActive: true,
  });

  if (!project) {
    throw new AppError('Project not found or access denied', 404);
  }

  project.isActive = false;
  await project.save();
};

const addMember = async (projectId, memberData, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isActive: true,
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const isAdmin = project.members.some(
    (member) => member.user.toString() === userId.toString() && member.role === 'ADMIN'
  );

  if (!isAdmin && project.owner.toString() !== userId.toString()) {
    throw new AppError('Only admins can add members', 403);
  }

  const userExists = await User.findById(memberData.userId);
  if (!userExists) {
    throw new AppError('User not found', 404);
  }

  const alreadyMember = project.members.some(
    (member) => member.user.toString() === memberData.userId
  );

  if (alreadyMember) {
    throw new AppError('User is already a member', 409);
  }

  project.members.push({
    user: memberData.userId,
    role: memberData.role || 'MEMBER',
  });

  await project.save();

  await notificationService.createNotification({
    recipient: memberData.userId,
    sender: userId,
    type: 'PROJECT_INVITE',
    title: 'Added to Project',
    message: `You have been added to project: ${project.name}`,
    relatedProject: projectId,
  });

  return await project.populate('owner members.user', 'name email role');
};

const removeMember = async (projectId, memberUserId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isActive: true,
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const isAdmin = project.members.some(
    (member) => member.user.toString() === userId.toString() && member.role === 'ADMIN'
  );

  if (!isAdmin && project.owner.toString() !== userId.toString()) {
    throw new AppError('Only admins can remove members', 403);
  }

  if (project.owner.toString() === memberUserId) {
    throw new AppError('Cannot remove project owner', 400);
  }

  project.members = project.members.filter(
    (member) => member.user.toString() !== memberUserId
  );

  await project.save();

  return await project.populate('owner members.user', 'name email role');
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
