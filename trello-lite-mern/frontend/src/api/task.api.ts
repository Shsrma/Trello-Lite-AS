// frontend/src/api/task.api.ts
import axiosInstance from './axios';

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedTo?: string | null;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string | null;
}

export interface ReorderTaskData {
  taskId: string;
  order: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export const taskAPI = {
  getTasksByProject: async (projectId: string) => {
    const response = await axiosInstance.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData) => {
    const response = await axiosInstance.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskData) => {
    const response = await axiosInstance.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  },

  reorderTasks: async (tasks: ReorderTaskData[]) => {
    const response = await axiosInstance.post('/tasks/reorder', { tasks });
    return response.data;
  },
};
