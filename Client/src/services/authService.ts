import api from '../utils/api';
import type { AuthResponse, LoginCredentials, RegisterData, User, ResetPasswordData, ChangePasswordData } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data.data; // Server returns data nested under 'data'
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  return response.data.data; // Server returns data nested under 'data'
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.data.user; // Server returns nested format
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<{ message: string }> => {
  const response = await api.put('/auth/change-password', data);
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/verify-email', { token });
  return response.data;
};

export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  const response = await api.post('/auth/resend-verification');
  return response.data;
};
