// frontend/src/api/project.api.ts
import axiosInstance from './axios';

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface AddMemberData {
  userId: string;
  role?: 'ADMIN' | 'MEMBER';
}

export const projectAPI = {
  getProjects: async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectData) => {
    const response = await axiosInstance.post('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: UpdateProjectData) => {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (id: string, data: AddMemberData) => {
    const response = await axiosInstance.post(`/projects/${id}/members`, data);
    return response.data;
  },

  removeMember: async (id: string, userId: string) => {
    const response = await axiosInstance.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },
};
