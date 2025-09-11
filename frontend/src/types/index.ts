// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// 单词相关类型
export interface Word {
  id: number;
  english: string;
  chinese: string;
  pronunciation: string;
  audio_url: string;
  image_url: string;
  difficulty_level: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  word_id: number;
  study_count: number;
  mastery_level: number;
  last_studied: string;
  created_at: string;
  updated_at: string;
}

export interface WordWithProgress {
  id: number;
  english: string;
  chinese: string;
  pronunciation: string;
  audio_url: string;
  image_url: string;
  difficulty_level: number;
  category: string;
  created_at: string;
  updated_at: string;
  user_progress?: UserProgress;
}

// 游戏相关类型
export type GameType = 'adventure' | 'defense' | 'dubbing';

export interface GameRecord {
  id: number;
  user_id: number;
  game_type: GameType;
  score: number;
  level_reached: number;
  time_spent: number;
  completed_at: string;
}

export interface AdventureGame {
  id: number;
  user_id: number;
  current_level: number;
  score: number;
  story: string;
  options: AdventureOption[];
  words: AdventureWord[];
  completed: boolean;
}

export interface AdventureOption {
  id: number;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface AdventureWord {
  id: number;
  english: string;
  chinese: string;
  required: boolean;
}

export interface DefenseGame {
  id: number;
  user_id: number;
  current_wave: number;
  score: number;
  health: number;
  coins: number;
  enemies: DefenseEnemy[];
  towers: DefenseTower[];
  words: DefenseWord[];
  completed: boolean;
}

export interface DefenseEnemy {
  id: number;
  type: string;
  health: number;
  speed: number;
  position: number;
  word_id: number;
}

export interface DefenseTower {
  id: number;
  type: string;
  level: number;
  damage: number;
  range: number;
  position: number;
  word_id: number;
}

export interface DefenseWord {
  id: number;
  english: string;
  chinese: string;
  correct: boolean;
  answered: boolean;
}

export interface DubbingGame {
  id: number;
  user_id: number;
  scene_id: number;
  score: number;
  scripts: DubbingScript[];
  completed: boolean;
}

export interface DubbingScript {
  id: number;
  character: string;
  text: string;
  audio_url: string;
  user_audio_url?: string;
  score?: number;
  completed: boolean;
}

// 排行榜相关类型
export type LeaderboardType = 'overall' | 'adventure' | 'defense' | 'dubbing' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  score: number;
  level: number;
  experience: number;
  rank: number;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  entries: LeaderboardEntry[];
  total: number;
  updated_at: string;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
