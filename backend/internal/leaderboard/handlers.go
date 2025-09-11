package leaderboard

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handlers struct {
	service *Service
}

func NewHandlers(service *Service) *Handlers {
	return &Handlers{
		service: service,
	}
}

// GetLeaderboard 获取排行榜
func (h *Handlers) GetLeaderboard(c *gin.Context) {
	var req LeaderboardRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.service.GetLeaderboard(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetUserRank 获取用户排名
func (h *Handlers) GetUserRank(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	leaderboardType := LeaderboardType(c.DefaultQuery("type", string(LeaderboardTypeOverall)))

	rank, err := h.service.GetUserRank(userID.(int), leaderboardType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"rank":    rank,
		"type":    leaderboardType,
	})
}

// GetTopPlayers 获取顶级玩家
func (h *Handlers) GetTopPlayers(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	req := &LeaderboardRequest{
		Type:  LeaderboardTypeOverall,
		Limit: limit,
	}

	response, err := h.service.GetLeaderboard(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"top_players": response.Entries,
		"total":       response.Total,
	})
}
