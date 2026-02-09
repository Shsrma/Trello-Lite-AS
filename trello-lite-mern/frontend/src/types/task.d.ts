// frontend/src/types/task.d.ts
import { User } from './user';
import { Project } from './project';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project | string;
  assignedTo?: User;
  createdBy: User;
  order: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
