package user

import (
	"database/sql"
	"errors"
	"fmt"
	"linguaforge/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	db  *sql.DB
	cfg *config.Config
}

func NewService(db *sql.DB, cfg *config.Config) *Service {
	return &Service{
		db:  db,
		cfg: cfg,
	}
}

// Register 用户注册
func (s *Service) Register(req *RegisterRequest) (*User, error) {
	// 检查用户名是否已存在
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", req.Username).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to check username: %w", err)
	}
	if count > 0 {
		return nil, errors.New("username already exists")
	}

	// 检查邮箱是否已存在
	err = s.db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", req.Email).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to check email: %w", err)
	}
	if count > 0 {
		return nil, errors.New("email already exists")
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// 创建用户
	result, err := s.db.Exec(`
		INSERT INTO users (username, email, password_hash, level, experience, coins)
		VALUES (?, ?, ?, 1, 0, 0)
	`, req.Username, req.Email, string(hashedPassword))
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	userID, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get user ID: %w", err)
	}

	// 获取创建的用户
	user, err := s.GetByID(int(userID))
	if err != nil {
		return nil, fmt.Errorf("failed to get created user: %w", err)
	}

	return user, nil
}

// Login 用户登录
func (s *Service) Login(req *LoginRequest) (*LoginResponse, error) {
	// 查找用户
	user, err := s.GetByUsername(req.Username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 验证密码
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 生成JWT token
	token, err := s.generateToken(user.ID, user.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}

// GetByID 根据ID获取用户
func (s *Service) GetByID(id int) (*User, error) {
	user := &User{}
	err := s.db.QueryRow(`
		SELECT id, username, email, password_hash, level, experience, coins, created_at, updated_at
		FROM users WHERE id = ?
	`, id).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash,
		&user.Level, &user.Experience, &user.Coins, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}

// GetByUsername 根据用户名获取用户
func (s *Service) GetByUsername(username string) (*User, error) {
	user := &User{}
	err := s.db.QueryRow(`
		SELECT id, username, email, password_hash, level, experience, coins, created_at, updated_at
		FROM users WHERE username = ?
	`, username).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash,
		&user.Level, &user.Experience, &user.Coins, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}

// GetProfile 获取用户资料
func (s *Service) GetProfile(userID int) (*UserProfile, error) {
	profile := &UserProfile{}
	err := s.db.QueryRow(`
		SELECT id, username, email, level, experience, coins
		FROM users WHERE id = ?
	`, userID).Scan(
		&profile.ID, &profile.Username, &profile.Email,
		&profile.Level, &profile.Experience, &profile.Coins,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}
	return profile, nil
}

// AddExperience 增加经验值
func (s *Service) AddExperience(userID int, exp int) error {
	_, err := s.db.Exec(`
		UPDATE users SET experience = experience + ?, updated_at = NOW()
		WHERE id = ?
	`, exp, userID)
	if err != nil {
		return fmt.Errorf("failed to add experience: %w", err)
	}
	return nil
}

// AddCoins 增加金币
func (s *Service) AddCoins(userID int, coins int) error {
	_, err := s.db.Exec(`
		UPDATE users SET coins = coins + ?, updated_at = NOW()
		WHERE id = ?
	`, coins, userID)
	if err != nil {
		return fmt.Errorf("failed to add coins: %w", err)
	}
	return nil
}

// generateToken 生成JWT token
func (s *Service) generateToken(userID int, username string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      time.Now().Add(time.Duration(s.cfg.JWT.ExpireHours) * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWT.Secret))
}

// ValidateToken 验证JWT token
func (s *Service) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.cfg.JWT.Secret), nil
	})
}
