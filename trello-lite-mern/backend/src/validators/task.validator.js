// backend/src/validators/task.validator.js
const { z } = require('zod');

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters').max(200, 'Task title cannot exceed 200 characters'),
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters').max(200, 'Task title cannot exceed 200 characters').optional(),
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
  }),
});

const reorderTasksSchema = z.object({
  body: z.object({
    tasks: z.array(
      z.object({
        taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
        order: z.number().int().min(0),
        status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
      })
    ).min(1, 'At least one task is required'),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
};
