// backend/src/services/task.service.js (CONTINUED - completing the updateTask function)
  if (newAssignee && newAssignee !== oldAssignee && newAssignee !== userId.toString()) {
    await notificationService.createNotification({
      recipient: newAssignee,
      sender: userId,
      type: 'TASK_ASSIGNED',
      title: 'Task Assigned',
      message: `You have been assigned to task: ${task.title}`,
      relatedTask: task._id,
      relatedProject: task.project._id,
    });
  }

  if (oldAssignee && oldAssignee !== newAssignee) {
    await notificationService.createNotification({
      recipient: oldAssignee,
      sender: userId,
      type: 'TASK_UPDATED',
      title: 'Task Updated',
      message: `Task "${task.title}" has been updated`,
      relatedTask: task._id,
      relatedProject: task.project._id,
    });
  }

  return await task.populate('assignedTo createdBy project', 'name email');
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  const project = await Project.findOne({
    _id: task.project,
    $or: [{ owner: userId }, { 'members.user': userId }],
    isActive: true,
  });

  if (!project) {
    throw new Error('Access denied');
  }

  const isAdmin = project.members.some(
    (member) => member.user.toString() === userId.toString() && member.role === 'ADMIN'
  );

  if (!isAdmin && project.owner.toString() !== userId.toString() && task.createdBy.toString() !== userId.toString()) {
    throw new Error('Only admins or task creator can delete tasks');
  }

  await Task.findByIdAndDelete(taskId);
};

const reorderTasks = async (tasksData, userId) => {
  const taskIds = tasksData.map((t) => t.taskId);
  const tasks = await Task.find({ _id: { $in: taskIds } }).populate('project');

  if (tasks.length !== taskIds.length) {
    throw new Error('Some tasks not found');
  }

  const projectId = tasks[0].project._id;
  const allSameProject = tasks.every((t) => t.project._id.toString() === projectId.toString());

  if (!allSameProject) {
    throw new Error('All tasks must belong to the same project');
  }

  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { 'members.user': userId }],
    isActive: true,
  });

  if (!project) {
    throw new Error('Access denied');
  }

  const bulkOps = tasksData.map((taskData) => ({
    updateOne: {
      filter: { _id: taskData.taskId },
      update: { order: taskData.order, status: taskData.status },
    },
  }));

  await Task.bulkWrite(bulkOps);

  return await Task.find({ _id: { $in: taskIds } })
    .populate('assignedTo createdBy', 'name email')
    .sort({ status: 1, order: 1 });
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
};
