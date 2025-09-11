package main

import (
	v1 "linguaforge/api/v1"
	"linguaforge/config"
	"linguaforge/storage"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库连接
	db, err := storage.InitDB(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 初始化Redis连接
	redisClient, err := storage.InitRedis(cfg)
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	// 设置Gin模式
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建Gin路由器
	router := gin.Default()

	// 设置CORS中间件
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 初始化API路由
	v1.SetupRoutes(router, db, redisClient, cfg)

	// 启动服务器
	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
