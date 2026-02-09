// frontend/src/schemas/task.schema.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
