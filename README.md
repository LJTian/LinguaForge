# LinguaForge - 游戏化英语学习平台

LinguaForge 是一个创新的英语学习平台，通过游戏化的方式让用户学习英语。项目采用现代化的技术栈，提供三种核心游戏模式：故事冒险、词汇塔防和互动配音。

## 🎮 游戏特色

### 三大游戏模式
- **📚 故事冒险** - 在有趣的故事情节中学习英语，通过选择正确的单词和语法来推进剧情发展
- **🏰 词汇塔防** - 建造防御塔来抵御错误词汇的进攻，通过正确回答问题来升级你的防御
- **🎤 互动配音** - 为电影片段配音，练习发音和语调，AI会评估你的发音准确性

### 核心功能
- **即时反馈系统** - 每个操作都有视觉和听觉反馈
- **进度追踪** - 显示学习时间、掌握单词量和等级
- **成就系统** - 各种学习成就徽章
- **排行榜** - 全球或好友排名系统
- **每日任务** - 培养学习习惯

## 🛠 技术架构

### 后端技术栈
- **Go** + **Gin** - 高性能后端框架
- **MariaDB** - 主数据库
- **Redis** - 缓存和排行榜
- **JWT** - 用户认证
- **Docker** - 容器化部署

### 前端技术栈
- **React** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **Axios** - HTTP客户端

## 🚀 快速开始

### 环境要求
- Go 1.21+
- Node.js 18+
- Docker & Docker Compose v2 (推荐)
- MariaDB 10.11+
- Redis 7+

### 1. 克隆项目
```bash
git clone https://github.com/LJTian/LinguaForge.git
cd LinguaForge
```

### 2. 后端设置
```bash
cd backend

# 复制环境配置文件
cp env.example .env

# 编辑配置文件
vim .env

# 安装依赖
go mod download

# 运行数据库迁移
mysql -u root -p < migrations/001_initial_schema.sql

# 启动后端服务
go run main.go
```

### 3. 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. Docker 部署

#### 一键启动 (推荐)
```bash
# 自动检测Docker Compose版本并启动
./start.sh

# 或者直接使用Docker Compose v2
./start-v2.sh
```

#### 手动启动
```bash
# 使用 Docker Compose v2 (推荐)
docker compose up -d

# 或者使用 Docker Compose v1
docker-compose up -d

# 查看服务状态
docker compose ps     # v2版本
# 或者
docker-compose ps     # v1版本

# 查看日志
docker compose logs -f  # v2版本
# 或者
docker-compose logs -f  # v1版本
```

#### 访问地址
启动成功后，可以通过以下地址访问：
- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8080
- **健康检查**: http://localhost:8080/health
- **数据库**: localhost:3307 (用户名: linguaforge, 密码: linguaforge_password)

## 📁 项目结构

```
LinguaForge/
├── backend/                 # Go后端
│   ├── api/                # API路由
│   ├── internal/           # 内部业务逻辑
│   │   ├── user/          # 用户模块
│   │   ├── content/       # 内容模块
│   │   ├── game/          # 游戏逻辑模块
│   │   └── leaderboard/   # 排行榜模块
│   ├── config/            # 配置管理
│   ├── storage/           # 数据库和缓存连接
│   ├── migrations/        # 数据库迁移文件
│   └── main.go           # 程序入口
├── frontend/              # React前端
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── stores/       # Zustand状态管理
│   │   ├── services/     # API服务
│   │   ├── types/        # TypeScript类型定义
│   │   └── utils/        # 工具函数
│   └── package.json
├── docker-compose.yml     # Docker编排文件
├── nginx.conf            # Nginx配置
└── README.md
```

## 🔧 配置说明

### 环境变量
```bash
# 后端配置
ENVIRONMENT=development
PORT=8080

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=linguaforge

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE_HOURS=24

# AWS S3配置（文件存储）
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=linguaforge-assets
AWS_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

## 📊 API 文档

### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录

### 用户相关
- `GET /api/v1/profile` - 获取用户资料
- `PUT /api/v1/profile` - 更新用户资料

### 词库相关
- `GET /api/v1/words` - 获取单词列表
- `GET /api/v1/words/:id` - 获取单个单词
- `POST /api/v1/words/progress` - 更新学习进度
- `GET /api/v1/words/progress` - 获取用户学习进度
- `GET /api/v1/words/categories` - 获取单词分类

### 游戏相关
- `POST /api/v1/games/start` - 开始游戏
- `POST /api/v1/games/submit` - 提交游戏分数
- `POST /api/v1/games/dubbing/upload` - 提交配音
- `GET /api/v1/games/history` - 获取游戏历史

### 排行榜相关
- `GET /api/v1/leaderboard` - 获取排行榜
- `GET /api/v1/leaderboard/rank` - 获取用户排名
- `GET /api/v1/leaderboard/top` - 获取顶级玩家

## 🎯 开发计划

### 已完成功能
- ✅ 用户注册/登录系统
- ✅ JWT认证中间件
- ✅ 词库管理系统
- ✅ 基础游戏框架
- ✅ 排行榜系统
- ✅ 前端基础架构
- ✅ Docker部署配置

### 待开发功能
- 🔄 游戏界面实现
- 🔄 AI发音评分
- 🔄 成就系统
- 🔄 每日任务
- 🔄 社交功能
- 🔄 移动端适配

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目链接: [https://github.com/LJTian/LinguaForge](https://github.com/LJTian/LinguaForge)
- 问题反馈: [Issues](https://github.com/LJTian/LinguaForge/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！