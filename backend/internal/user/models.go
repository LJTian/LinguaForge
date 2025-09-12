package user

import (
	"time"
)

// User 用户模型
type User struct {
	ID                int       `json:"id" db:"id"`
	Username          string    `json:"username" db:"username"`
	Email             string    `json:"email" db:"email"`
	PasswordHash      string    `json:"-" db:"password_hash"`
	Level             int       `json:"level" db:"level"`
	Experience        int       `json:"experience" db:"experience"`
	Coins             int       `json:"coins" db:"coins"`
	PreferredCategory string    `json:"preferred_category" db:"preferred_category"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// UserProfile 用户资料
type UserProfile struct {
	ID                int    `json:"id"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	Level             int    `json:"level"`
	Experience        int    `json:"experience"`
	Coins             int    `json:"coins"`
	PreferredCategory string `json:"preferred_category"`
}
