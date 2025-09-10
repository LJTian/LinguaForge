### LinguaForge 技术架构设计 (MVP 精简版)

此架构的核心目标是：**快速开发、易于部署、低启动成本、性能卓越**。我们采用一个“模块化单体”或“精简服务”的后端方法，以便于初期快速迭代。

#### 1\. 总体架构图 (Architecture Overview - MVP)

这个简化版的架构去掉了 AI 服务和消息队列，将核心后端逻辑集中管理，但内部依然保持模块化，为未来的拆分做好准备。

```
+----------------+      +-----------------+      +------------------------+
|    用户 (Web)  |----->|  Nginx / Caddy  |----->|     Go (Gin) 应用      |
|  (React App)   |      | (Reverse Proxy) |      |   (Backend Application)|
+----------------+      +-----------------+      +------------------------+
        |                                                 |
        | (静态资源)                                        | (API 调用)
        |                                                 |
+-------v--------+      +----------------+      +---------v--------+
| 对象存储 (S3)  |      |  Redis Cache   |<---->|     MariaDB      |
| (Cloudflare R2)|      |  (排行榜等)    |      |    (核心数据库)  |
+----------------+      +----------------+      +------------------+
```

#### 2\. 前端架构 (Frontend Architecture)

  * **技术栈**: **React**
      * **开发工具**: 推荐使用 **Vite** 来创建和构建项目。Vite 提供了极速的开发服务器和优化的构建流程，开发体验远超传统的 `Create React App`。
      * **框架 (可选)**: 如果未来需要 SEO 或更复杂的路由管理，可以考虑迁移到 **Next.js**。但对于 MVP 阶段，纯 React + Vite 是最轻量和高效的选择。
  * **状态管理**: 使用 **Zustand** 或 **Redux Toolkit**。Zustand 非常轻量级且易于上手，非常适合新项目。
  * **路由管理**: 使用 **React Router** 来处理页面跳转和 URL 管理。
  * **API 通信**: `axios` 依然是最佳选择，便于设置统一的请求/响应拦截器（例如，自动附加 JWT）。
  * **静态资源**: 网站的图片、标准发音文件等应直接由前端上传至对象存储，并将 URL 地址提交给后端保存。这可以极大减轻后端服务器的带宽压力。

#### 3\. 后端架构 (Backend Architecture)

  * **技术栈**: **Go** + **Gin** 框架

      * **为什么选择 Go/Gin?** Go 语言以其卓越的并发性能、极低的内存占用和编译成单个二进制文件的便利性而著称。Gin 是一个高性能、API 友好的 Web 框架，非常适合构建高效的 RESTful API。

  * **项目结构 (模块化单体)**:
    在单个 Go 应用中，通过包（package）来划分逻辑模块，保持代码的清晰和高内聚。

    ```
    linguaforge/
    ├── main.go               # 程序入口
    ├── api/                  # API 路由定义 (router)
    │   ├── v1/
    │   └── routes.go
    ├── internal/             # 内部业务逻辑
    │   ├── user/             # 用户模块：注册、登录、信息
    │   ├── content/          # 内容模块：词库管理
    │   ├── game/             # 游戏逻辑模块：三大游戏核心逻辑
    │   └── leaderboard/      # 排行榜模块
    ├── config/               # 配置管理
    └── storage/              # 数据库和缓存的连接
    ```

  * **核心模块职责**:

    1.  **用户模块 (user)**: 负责 JWT 的生成与验证、用户注册、登录、个人信息管理。
    2.  **内容模块 (content)**: 负责管理 `words` 表等词库内容，提供搜索和筛选 API。
    3.  **游戏逻辑模块 (game)**: 负责处理三大游戏的核心规则、计分和状态管理。API 设计与之前保持一致。
    4.  **排行榜模块 (leaderboard)**: 游戏结束后，调用此模块的逻辑将分数更新到 Redis 和 MariaDB。查询时优先从 Redis 读取。

#### 4\. 数据存储 (Data Storage)

  * **主数据库**: **MariaDB**

      * MariaDB 是 MySQL 的一个非常流行的、完全兼容的开源分支，性能稳定可靠，完全能满足您的需求。
      * 您的表结构设计（`users`, `words`, `user_progress`, `game_records`）可以直接迁移过来使用，无需做大的改动。

  * **缓存**: **Redis**

      * **强烈建议保留**。即使在 MVP 阶段，Redis 对于实现高性能排行榜也是至关重要的。使用 Redis 的有序集合 (Sorted Set) 可以轻松实现实时排名，避免每次查询都对数据库进行复杂的排序操作，从而显著提升用户体验。

  * **免费对象存储 (S3 兼容)**:
    您需要一个提供 S3 兼容 API 的免费对象存储服务。这里有几个绝佳的选择：

    1.  **Cloudflare R2**: **强烈推荐**。它提供非常慷慨的免费额度（每月 10GB 存储，无限次 A 类操作，1000 万次 B 类操作），最关键的是 **没有出口带宽费用**。这意味着用户下载图片和音频文件不会产生额外费用，长期来看能节省大量成本。
    2.  **Backblaze B2**: 另一个优秀的选择。提供 10GB 的免费存储空间和每日 1GB 的免费下载流量。
    3.  **AWS S3 Free Tier**: AWS 官方也提供免费套餐（5GB 存储，一年内有效），但出口带宽费用需要注意。

    在 Go 应用中，您可以使用官方的 AWS S3 SDK，只需将 endpoint 指向您选择的 S3 兼容服务的地址即可。

#### 5\. API 设计示例 (Go/Gin 风格)

```go
// main.go
func main() {
    router := gin.Default()

    // API v1 group
    v1 := router.Group("/api/v1")
    {
        // User routes
        v1.POST("/register", user.RegisterHandler)
        v1.POST("/login", user.LoginHandler)

        // Game routes (protected by auth middleware)
        gameRoutes := v1.Group("/game")
        gameRoutes.Use(authMiddleware()) // JWT 认证中间件
        {
            gameRoutes.GET("/adventure/start", game.GetAdventureData)
            gameRoutes.POST("/defense/submit", game.SubmitDefenseScore)
            gameRoutes.POST("/dubbing/upload", game.HandleDubbingSubmission) // 注意：这里只保存记录，不做评分
        }
        
        // Word routes
        v1.GET("/words", content.GetWords)

        // Leaderboard routes
        v1.GET("/leaderboard", leaderboard.GetLeaderboard)
    }

    router.Run(":8080")
}
```

#### 6\. 部署方案 (Deployment)

对于 MVP 阶段，我们选择简单且成本效益高的方案：

  * **容器化**: 使用 **Docker** 将您的 Go 应用和 MariaDB、Redis 分别打包成镜像。
  * **部署**:
    1.  **单台 VPS (虚拟专用服务器)**: 在 DigitalOcean, Vultr 或 Linode 等云服务商购买一台低配的服务器（例如每月 5-10 美元）。
    2.  **Docker Compose**: 使用 `docker-compose.yml` 文件来编排和运行您的应用容器、数据库容器和缓存容器。这是最简单、最快速的部署方式。
    3.  **反向代理**: 在服务器上安装 Nginx 或 Caddy 作为反向代理，负责处理 HTTPS 证书（Caddy 可自动完成）并将请求转发到您的 Go 应用容器。

### 未来规划 (关于被搁置的功能)

这个架构为未来的扩展留下了清晰的路径：

  * **AI 发音评分服务**: 当您准备好实现此功能时，可以：
    1.  独立创建一个 Python 服务。
    2.  引入消息队列（如 NATS 或 RabbitMQ）。
    3.  Go 应用在接收到配音提交后，不再是简单保存，而是向消息队列发送一个“评分任务”。
    4.  Python AI 服务监听队列，处理任务，并将结果写回数据库。
        这个过程无需修改现有 Go 应用的核心逻辑，实现了平滑升级。