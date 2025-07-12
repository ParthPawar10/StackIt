import api from '../utils/api';
import type { AuthResponse, LoginCredentials, RegisterData, User, ResetPasswordData, ChangePasswordData } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success && response.data.data) {
    return {
      user: response.data.data.user,
      token: response.data.data.token,
      refreshToken: response.data.data.refreshToken
    };
  }
  throw new Error(response.data.message || 'Login failed');
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success && response.data.data) {
    return {
      user: response.data.data.user,
      token: response.data.data.token,
      refreshToken: response.data.data.refreshToken
    };
  }
  throw new Error(response.data.message || 'Registration failed');
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  if (response.data.success && response.data.data) {
    return response.data.data.user || response.data.data;
  }
  throw new Error(response.data.message || 'Failed to get user data');
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
