import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';
import * as authService from '../services/authService.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          console.log('Found token, getting user data...');
          
          // Verify the token format
          if (token.startsWith('Bearer ')) {
            localStorage.setItem('token', token.substring(7));
          }
          
          const userData = await authService.getCurrentUser();
          console.log('User data:', userData);
          setUser(userData);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear both storage types on error
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      } finally {
        console.log('Auth initialization complete');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      setUser(response.user);
      
      // Store token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('token', response.token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', response.token);
        localStorage.removeItem('token');
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error in context:', error);
      
      // Clear any existing tokens on login failure
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const updateUserFromToken = async (token: string) => {
    try {
      localStorage.setItem('token', token);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to update user from token:', error);
      localStorage.removeItem('token');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    updateUserFromToken,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
