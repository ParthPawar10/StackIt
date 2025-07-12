import axios from 'axios';
import type { Notification } from '../types/index.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const notificationAPI = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
notificationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getNotifications = async (page = 1, limit = 20): Promise<Notification[]> => {
  const response = await notificationAPI.get('/', {
    params: { page, limit }
  });
  return response.data.notifications;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await notificationAPI.get('/unread-count');
  return response.data.count;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await notificationAPI.patch(`/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await notificationAPI.patch('/mark-all-read');
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await notificationAPI.delete(`/${notificationId}`);
};

export const updateNotificationSettings = async (settings: {
  email: boolean;
  push: boolean;
  mentions: boolean;
  answers: boolean;
  comments: boolean;
  votes: boolean;
}): Promise<void> => {
  await notificationAPI.put('/settings', settings);
};
