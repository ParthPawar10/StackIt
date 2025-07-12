import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterData, User, ResetPasswordData, ChangePasswordData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use(
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

// Handle token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await authAPI.post('/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await authAPI.post('/register', userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await authAPI.post('/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await authAPI.get('/me');
  return response.data;
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await authAPI.post('/refresh');
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await authAPI.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  const response = await authAPI.post('/reset-password', data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<{ message: string }> => {
  const response = await authAPI.put('/change-password', data);
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await authAPI.post('/verify-email', { token });
  return response.data;
};

export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  const response = await authAPI.post('/resend-verification');
  return response.data;
};
