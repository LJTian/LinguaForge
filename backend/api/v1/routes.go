package v1

import (
	"database/sql"
	"linguaforge/config"
	"linguaforge/internal/content"
	"linguaforge/internal/game"
	"linguaforge/internal/leaderboard"
	"linguaforge/internal/user"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func SetupRoutes(router *gin.Engine, db *sql.DB, redis *redis.Client, cfg *config.Config) {
	// 初始化服务
	userService := user.NewService(db, cfg)
	userHandlers := user.NewHandlers(userService)

	contentService := content.NewService(db)
	contentHandlers := content.NewHandlers(contentService)

	gameService := game.NewService(db)
	gameHandlers := game.NewHandlers(gameService)

	leaderboardService := leaderboard.NewService(db, redis)
	leaderboardHandlers := leaderboard.NewHandlers(leaderboardService)

	// API v1 路由组
	v1 := router.Group("/api/v1")
	{
		// 用户相关路由（无需认证）
		auth := v1.Group("/auth")
		{
			auth.POST("/register", userHandlers.Register)
			auth.POST("/login", userHandlers.Login)
		}

		// 需要认证的路由
		authenticated := v1.Group("")
		authenticated.Use(userHandlers.AuthMiddleware())
		{
			// 用户资料
			authenticated.GET("/profile", userHandlers.GetProfile)
			authenticated.PUT("/profile", userHandlers.UpdateProfile)

			// 词库相关
			words := authenticated.Group("/words")
			{
				words.GET("", contentHandlers.GetWords)
				words.GET("/:id", contentHandlers.GetWord)
				words.POST("/progress", contentHandlers.UpdateProgress)
				words.GET("/progress", contentHandlers.GetUserProgress)
				words.GET("/categories", contentHandlers.GetCategories)
			}

			// 游戏相关
			games := authenticated.Group("/games")
			{
				// 通用游戏接口
				games.POST("/start", gameHandlers.StartGame)
				games.POST("/submit", gameHandlers.SubmitScore)
				games.GET("/history", gameHandlers.GetGameHistory)

				// 冒险游戏
				games.GET("/adventure/start", gameHandlers.GetAdventureData)

				// 塔防游戏
				games.POST("/defense/submit", gameHandlers.SubmitDefenseScore)

				// 配音游戏
				games.POST("/dubbing/upload", gameHandlers.HandleDubbingSubmission)
			}

			// 排行榜相关
			leaderboard := authenticated.Group("/leaderboard")
			{
				leaderboard.GET("", leaderboardHandlers.GetLeaderboard)
				leaderboard.GET("/rank", leaderboardHandlers.GetUserRank)
				leaderboard.GET("/top", leaderboardHandlers.GetTopPlayers)
			}
		}

		// 公开路由（无需认证）
		public := v1.Group("/public")
		{
			public.GET("/leaderboard", leaderboardHandlers.GetLeaderboard)
			public.GET("/leaderboard/top", leaderboardHandlers.GetTopPlayers)
		}
	}

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "linguaforge-api",
			"version": "1.0.0",
		})
	})
}
