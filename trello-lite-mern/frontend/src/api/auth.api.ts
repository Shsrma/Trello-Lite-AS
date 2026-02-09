// frontend/src/api/auth.api.ts (COMPLETE)
import axiosInstance from './axios';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MEMBER';
}

export interface LoginData {
  email: string;
  password: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
