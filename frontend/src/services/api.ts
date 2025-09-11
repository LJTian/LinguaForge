import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { LoginRequest, RegisterRequest, LoginResponse, UserProfile, WordWithProgress, GameRecord, LeaderboardResponse, UserProgress, LeaderboardEntry, AdventureGame, DefenseGame, DubbingGame, User } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加认证token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理错误
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token过期或无效，清除本地存储并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 认证相关
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string; user: User }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // 用户相关
  async getProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<UserProfile>): Promise<{ message: string }> {
    const response = await this.api.put('/profile', userData);
    return response.data;
  }

  // 词库相关
  async getWords(params?: {
    category?: string;
    difficulty?: number;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ words: WordWithProgress[]; total: number }> {
    const response = await this.api.get('/words', { params });
    return response.data;
  }

  async getWord(id: number): Promise<WordWithProgress> {
    const response: AxiosResponse<WordWithProgress> = await this.api.get(`/words/${id}`);
    return response.data;
  }

  async updateProgress(data: {
    word_id: number;
    study_count: number;
    mastery_level: number;
  }): Promise<{ message: string }> {
    const response = await this.api.post('/words/progress', data);
    return response.data;
  }

  async getUserProgress(): Promise<{ progress: UserProgress[]; total: number }> {
    const response = await this.api.get('/words/progress');
    return response.data;
  }

  async getCategories(): Promise<{ categories: string[] }> {
    const response = await this.api.get('/words/categories');
    return response.data;
  }

  // 游戏相关
  async startGame(gameType: string, level?: number): Promise<{ game: AdventureGame | DefenseGame | DubbingGame }> {
    const response = await this.api.post('/games/start', {
      game_type: gameType,
      level: level || 1,
    });
    return response.data;
  }

  async submitScore(data: {
    game_type: string;
    score: number;
    level_reached: number;
    time_spent: number;
    game_data?: string;
  }): Promise<{ message: string }> {
    const response = await this.api.post('/games/submit', data);
    return response.data;
  }

  async submitDubbing(data: {
    scene_id: number;
    script_id: number;
    audio_data: string;
    time_spent: number;
  }): Promise<{ message: string }> {
    const response = await this.api.post('/games/dubbing/upload', data);
    return response.data;
  }

  async getGameHistory(gameType?: string, limit?: number): Promise<{ history: GameRecord[]; total: number }> {
    const params: Record<string, string | number> = {};
    if (gameType) params.game_type = gameType;
    if (limit) params.limit = limit;

    const response = await this.api.get('/games/history', { params });
    return response.data;
  }

  // 排行榜相关
  async getLeaderboard(type?: string, limit?: number): Promise<LeaderboardResponse> {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    if (limit) params.limit = limit;

    const response: AxiosResponse<LeaderboardResponse> = await this.api.get('/leaderboard', { params });
    return response.data;
  }

  async getUserRank(type?: string): Promise<{ user_id: number; rank: number; type: string }> {
    const params: Record<string, string> = {};
    if (type) params.type = type;

    const response = await this.api.get('/leaderboard/rank', { params });
    return response.data;
  }

  async getTopPlayers(limit?: number): Promise<{ top_players: LeaderboardEntry[]; total: number }> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;

    const response = await this.api.get('/leaderboard/top', { params });
    return response.data;
  }
}

export const apiService = new ApiService();
