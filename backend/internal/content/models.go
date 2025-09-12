package content

import (
	"time"
)

// Word 单词模型
type Word struct {
	ID              int       `json:"id" db:"id"`
	English         string    `json:"english" db:"english"`
	Chinese         string    `json:"chinese" db:"chinese"`
	Pronunciation   string    `json:"pronunciation" db:"pronunciation"`
	AudioURL        string    `json:"audio_url" db:"audio_url"`
	ImageURL        string    `json:"image_url" db:"image_url"`
	Story           string    `json:"story" db:"story"`
	DifficultyLevel int       `json:"difficulty_level" db:"difficulty_level"`
	Category        string    `json:"category" db:"category"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// UserProgress 用户学习进度
type UserProgress struct {
	ID           int       `json:"id" db:"id"`
	UserID       int       `json:"user_id" db:"user_id"`
	WordID       int       `json:"word_id" db:"word_id"`
	StudyCount   int       `json:"study_count" db:"study_count"`
	MasteryLevel float64   `json:"mastery_level" db:"mastery_level"`
	LastStudied  time.Time `json:"last_studied" db:"last_studied"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// WordWithProgress 带进度的单词
type WordWithProgress struct {
	Word
	UserProgress *UserProgress `json:"user_progress,omitempty"`
}

// GetWordsRequest 获取单词请求
type GetWordsRequest struct {
	Category   string `form:"category"`
	Difficulty int    `form:"difficulty"`
	Limit      int    `form:"limit"`
	Offset     int    `form:"offset"`
	Search     string `form:"search"`
}

// UpdateProgressRequest 更新进度请求
type UpdateProgressRequest struct {
	WordID       int     `json:"word_id" binding:"required"`
	StudyCount   int     `json:"study_count"`
	MasteryLevel float64 `json:"mastery_level"`
}
