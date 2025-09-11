import { create } from 'zustand';
import { isAxiosError } from 'axios';
import type { GameRecord, AdventureGame, DefenseGame, DubbingGame, GameType } from '../types';
import { apiService } from '../services/api';

interface GameState {
  currentGame: AdventureGame | DefenseGame | DubbingGame | null;
  gameHistory: GameRecord[];
  isLoading: boolean;
  error: string | null;
}

interface GameActions {
  startGame: (gameType: GameType, level?: number) => Promise<void>;
  submitScore: (data: {
    game_type: GameType;
    score: number;
    level_reached: number;
    time_spent: number;
    game_data?: string;
  }) => Promise<void>;
  submitDubbing: (data: {
    scene_id: number;
    script_id: number;
    audio_data: string;
    time_spent: number;
  }) => Promise<void>;
  getGameHistory: (gameType?: GameType, limit?: number) => Promise<void>;
  clearCurrentGame: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set) => ({
  // 初始状态
  currentGame: null,
  gameHistory: [],
  isLoading: false,
  error: null,

  // 开始游戏
  startGame: async (gameType: GameType, level = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.startGame(gameType, level);
      set({
        currentGame: response.game,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let errorMessage = '开始游戏失败';
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

  // 提交分数
  submitScore: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.submitScore(data);
      set({ isLoading: false, error: null });
    } catch (error: unknown) {
      let errorMessage = '提交分数失败';
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

  // 提交配音
  submitDubbing: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.submitDubbing(data);
      set({ isLoading: false, error: null });
    } catch (error: unknown) {
      let errorMessage = '提交配音失败';
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

  // 获取游戏历史
  getGameHistory: async (gameType?: GameType, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getGameHistory(gameType, limit);
      set({
        gameHistory: response.history,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let errorMessage = '获取游戏历史失败';
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

  // 清除当前游戏
  clearCurrentGame: () => {
    set({ currentGame: null });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));
