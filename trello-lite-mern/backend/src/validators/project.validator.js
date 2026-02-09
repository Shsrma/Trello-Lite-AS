// backend/src/validators/project.validator.js
const { z } = require('zod');

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
});

const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
  }),
  body: z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
});

const addMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
  }),
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    role: z.enum(['ADMIN', 'MEMBER']).optional(),
  }),
});

const removeMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  removeMemberSchema,
};
