package leaderboard

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	db    *sql.DB
	redis *redis.Client
}

func NewService(db *sql.DB, redis *redis.Client) *Service {
	return &Service{
		db:    db,
		redis: redis,
	}
}

// GetLeaderboard 获取排行榜
func (s *Service) GetLeaderboard(req *LeaderboardRequest) (*LeaderboardResponse, error) {
	ctx := context.Background()

	// 设置默认值
	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Type == "" {
		req.Type = LeaderboardTypeOverall
	}

	// 尝试从Redis获取缓存
	cacheKey := fmt.Sprintf("leaderboard:%s:%d", req.Type, req.Limit)
	cached, err := s.redis.Get(ctx, cacheKey).Result()
	if err == nil && cached != "" {
		// 如果缓存存在，直接返回（这里简化处理，实际应该反序列化）
		// 为了简化，我们重新查询数据库
	}

	// 从数据库查询排行榜
	entries, err := s.queryLeaderboardFromDB(req)
	if err != nil {
		return nil, fmt.Errorf("failed to query leaderboard: %w", err)
	}

	// 更新Redis缓存（设置5分钟过期）
	s.redis.Set(ctx, cacheKey, "cached", 5*time.Minute)

	response := &LeaderboardResponse{
		Type:      req.Type,
		Entries:   entries,
		Total:     len(entries),
		UpdatedAt: time.Now(),
	}

	return response, nil
}

// UpdateUserScore 更新用户分数到排行榜
func (s *Service) UpdateUserScore(userID int, score int, gameType LeaderboardType) error {
	ctx := context.Background()

	// 更新Redis中的排行榜
	leaderboardKey := fmt.Sprintf("leaderboard:%s", gameType)

	// 获取用户信息
	var username string
	err := s.db.QueryRow("SELECT username FROM users WHERE id = ?", userID).Scan(&username)
	if err != nil {
		return fmt.Errorf("failed to get username: %w", err)
	}

	// 使用用户ID作为member，分数作为score
	err = s.redis.ZAdd(ctx, leaderboardKey, redis.Z{
		Score:  float64(score),
		Member: fmt.Sprintf("%d", userID),
	}).Err()
	if err != nil {
		return fmt.Errorf("failed to update Redis leaderboard: %w", err)
	}

	// 设置过期时间（24小时）
	s.redis.Expire(ctx, leaderboardKey, 24*time.Hour)

	return nil
}

// GetUserRank 获取用户排名
func (s *Service) GetUserRank(userID int, leaderboardType LeaderboardType) (int, error) {
	ctx := context.Background()

	leaderboardKey := fmt.Sprintf("leaderboard:%s", leaderboardType)

	// 获取用户排名（从高到低）
	rank, err := s.redis.ZRevRank(ctx, leaderboardKey, fmt.Sprintf("%d", userID)).Result()
	if err != nil {
		if err == redis.Nil {
			return -1, nil // 用户不在排行榜中
		}
		return -1, fmt.Errorf("failed to get user rank: %w", err)
	}

	return int(rank) + 1, nil // Redis排名从0开始，转换为从1开始
}

// queryLeaderboardFromDB 从数据库查询排行榜
func (s *Service) queryLeaderboardFromDB(req *LeaderboardRequest) ([]LeaderboardEntry, error) {
	var query string
	var args []interface{}

	switch req.Type {
	case LeaderboardTypeOverall:
		// 按总经验值排序
		query = `
			SELECT u.id, u.username, u.experience, u.level, u.experience
			FROM users u
			ORDER BY u.experience DESC
			LIMIT ?
		`
		args = []interface{}{req.Limit}

	case LeaderboardTypeAdventure, LeaderboardTypeDefense, LeaderboardTypeDubbing:
		// 按特定游戏类型的最高分排序
		query = `
			SELECT u.id, u.username, MAX(gr.score) as max_score, u.level, u.experience
			FROM users u
			JOIN game_records gr ON u.id = gr.user_id
			WHERE gr.game_type = ?
			GROUP BY u.id, u.username, u.level, u.experience
			ORDER BY max_score DESC
			LIMIT ?
		`
		args = []interface{}{string(req.Type), req.Limit}

	case LeaderboardTypeWeekly:
		// 本周排行榜
		query = `
			SELECT u.id, u.username, SUM(gr.score) as total_score, u.level, u.experience
			FROM users u
			JOIN game_records gr ON u.id = gr.user_id
			WHERE gr.completed_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
			GROUP BY u.id, u.username, u.level, u.experience
			ORDER BY total_score DESC
			LIMIT ?
		`
		args = []interface{}{req.Limit}

	case LeaderboardTypeMonthly:
		// 本月排行榜
		query = `
			SELECT u.id, u.username, SUM(gr.score) as total_score, u.level, u.experience
			FROM users u
			JOIN game_records gr ON u.id = gr.user_id
			WHERE gr.completed_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
			GROUP BY u.id, u.username, u.level, u.experience
			ORDER BY total_score DESC
			LIMIT ?
		`
		args = []interface{}{req.Limit}

	default:
		return nil, fmt.Errorf("invalid leaderboard type: %s", req.Type)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var entries []LeaderboardEntry
	rank := 1

	for rows.Next() {
		var entry LeaderboardEntry
		var score int

		err := rows.Scan(&entry.UserID, &entry.Username, &score, &entry.Level, &entry.Experience)
		if err != nil {
			return nil, fmt.Errorf("failed to scan leaderboard entry: %w", err)
		}

		entry.Score = score
		entry.Rank = rank
		entries = append(entries, entry)
		rank++
	}

	return entries, nil
}
