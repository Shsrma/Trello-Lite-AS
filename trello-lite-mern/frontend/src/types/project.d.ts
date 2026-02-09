// frontend/src/types/project.d.ts
import { User } from './user';

export interface ProjectMember {
  user: User;
  role: 'ADMIN' | 'MEMBER';
  addedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
