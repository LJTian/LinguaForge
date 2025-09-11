import { create } from 'zustand';
import { isAxiosError } from 'axios';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { apiService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  // 初始状态
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // 登录
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(credentials);
      
      // 保存token到localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let errorMessage = '登录失败';
      if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string } | undefined;
        if (data?.error) errorMessage = data.error;
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 注册
  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.register(userData);
      set({ isLoading: false, error: null });
    } catch (error: unknown) {
      let errorMessage = '注册失败';
      if (isAxiosError(error)) {
        const data = error.response?.data as { error?: string } | undefined;
        if (data?.error) errorMessage = data.error;
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 初始化认证状态
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        // 如果解析失败，清除无效数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
