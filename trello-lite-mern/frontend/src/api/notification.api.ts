// frontend/src/api/notification.api.ts
import axiosInstance from './axios';

export const notificationAPI = {
  getNotifications: async (params?: { isRead?: boolean; limit?: number; skip?: number }) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },
};
