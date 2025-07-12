import api from '../utils/api';
import type { Notification } from '../types/index.ts';

export const getNotifications = async (page = 1, limit = 20): Promise<Notification[]> => {
  const response = await api.get('/notifications', {
    params: { page, limit }
  });
  return response.data.data.notifications; // Server returns nested format
};

export const getUnreadCount = async (): Promise<number> => {
  // Get unread count from the main notifications endpoint
  const response = await api.get('/notifications', {
    params: { page: 1, limit: 1 } // Just get one notification to get the count
  });
  return response.data.data.unreadCount; // Server returns nested format
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.put(`/notifications/${notificationId}/read`); // Changed from PATCH to PUT
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all'); // Corrected endpoint path
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await api.delete(`/notifications/${notificationId}`);
};

export const updateNotificationSettings = async (settings: {
  email: boolean;
  push: boolean;
  mentions: boolean;
  answers: boolean;
  comments: boolean;
  votes: boolean;
}): Promise<void> => {
  await api.put('/notifications/settings', settings);
};
