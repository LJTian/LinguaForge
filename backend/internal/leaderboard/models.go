package leaderboard

import (
	"time"
)

// LeaderboardEntry 排行榜条目
type LeaderboardEntry struct {
	UserID     int    `json:"user_id"`
	Username   string `json:"username"`
	Score      int    `json:"score"`
	Level      int    `json:"level"`
	Experience int    `json:"experience"`
	Rank       int    `json:"rank"`
}

// LeaderboardType 排行榜类型
type LeaderboardType string

const (
	LeaderboardTypeOverall   LeaderboardType = "overall"
	LeaderboardTypeAdventure LeaderboardType = "adventure"
	LeaderboardTypeDefense   LeaderboardType = "defense"
	LeaderboardTypeDubbing   LeaderboardType = "dubbing"
	LeaderboardTypeWeekly    LeaderboardType = "weekly"
	LeaderboardTypeMonthly   LeaderboardType = "monthly"
)

// LeaderboardRequest 排行榜请求
type LeaderboardRequest struct {
	Type  LeaderboardType `form:"type"`
	Limit int             `form:"limit"`
}

// LeaderboardResponse 排行榜响应
type LeaderboardResponse struct {
	Type      LeaderboardType    `json:"type"`
	Entries   []LeaderboardEntry `json:"entries"`
	Total     int                `json:"total"`
	UpdatedAt time.Time          `json:"updated_at"`
}
