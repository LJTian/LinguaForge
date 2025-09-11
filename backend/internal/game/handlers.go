package game

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

// StartGame 开始游戏
func (h *Handlers) StartGame(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req GameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var game interface{}
	var err error

	switch req.GameType {
	case GameTypeAdventure:
		game, err = h.service.StartAdventureGame(userID.(int), req.Level)
	case GameTypeDefense:
		game, err = h.service.StartDefenseGame(userID.(int), req.Level)
	case GameTypeDubbing:
		game, err = h.service.StartDubbingGame(userID.(int), req.Level)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game type"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, GameResponse{Game: game})
}

// SubmitScore 提交游戏分数
func (h *Handlers) SubmitScore(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req SubmitScoreRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.SubmitScore(userID.(int), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score submitted successfully"})
}

// SubmitDubbing 提交配音
func (h *Handlers) SubmitDubbing(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req SubmitDubbingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.SubmitDubbing(userID.(int), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dubbing submitted successfully"})
}

// GetGameHistory 获取游戏历史
func (h *Handlers) GetGameHistory(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	gameType := GameType(c.Query("game_type"))
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	history, err := h.service.GetGameHistory(userID.(int), gameType, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"history": history,
		"total":   len(history),
	})
}

// GetAdventureData 获取冒险游戏数据（兼容原API设计）
func (h *Handlers) GetAdventureData(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	levelStr := c.DefaultQuery("level", "1")
	level, err := strconv.Atoi(levelStr)
	if err != nil {
		level = 1
	}

	game, err := h.service.StartAdventureGame(userID.(int), level)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, game)
}

// SubmitDefenseScore 提交塔防游戏分数（兼容原API设计）
func (h *Handlers) SubmitDefenseScore(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req SubmitScoreRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.GameType = GameTypeDefense

	err := h.service.SubmitScore(userID.(int), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Defense score submitted successfully"})
}

// HandleDubbingSubmission 处理配音提交（兼容原API设计）
func (h *Handlers) HandleDubbingSubmission(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req SubmitDubbingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.SubmitDubbing(userID.(int), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dubbing submission received"})
}
