import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthState, User, ApiResponse } from '../types';
import api from '../utils/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
          if (response.data.success && response.data.data) {
            dispatch({
              type: 'SET_USER',
              payload: { user: response.data.data.user, token },
            });
          } else {
            localStorage.removeItem('authToken');
            dispatch({ type: 'CLEAR_USER' });
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          dispatch({ type: 'CLEAR_USER' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('authToken', token);
        dispatch({ type: 'SET_USER', payload: { user, token } });
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('authToken', token);
        dispatch({ type: 'SET_USER', payload: { user, token } });
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'CLEAR_USER' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
