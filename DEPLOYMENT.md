# LinguaForge 部署指南

## 🚀 快速部署

### 使用 Docker Compose v2 (推荐)

```bash
# 1. 测试环境
./test-docker.sh

# 2. 启动项目
./start-v2.sh

# 3. 访问应用
# 前端: http://localhost:3000
# 后端API: http://localhost:8080
# 健康检查: http://localhost:8080/health
```

### 使用自动检测脚本

```bash
# 自动检测Docker Compose版本并启动
./start.sh
```

## 🔧 环境要求

- **Docker**: 20.10+
- **Docker Compose**: v2.0+ (推荐)
- **可用端口**: 3000, 8080, 3307, 6379

## 📊 服务架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (3000)  │────│  Backend (8080) │────│  MariaDB (3307) │
│   (前端代理)     │    │   (Go API)      │    │   (数据库)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Redis (6379)  │
                       │   (缓存/排行榜)  │
                       └─────────────────┘
```

## 🛠 常用命令

### 服务管理
```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
```

### 数据库操作
```bash
# 连接数据库
docker compose exec mariadb mysql -u linguaforge -p linguaforge

# 备份数据库
docker compose exec mariadb mysqldump -u linguaforge -p linguaforge > backup.sql

# 恢复数据库
docker compose exec -i mariadb mysql -u linguaforge -p linguaforge < backup.sql
```

### 开发调试
```bash
# 进入后端容器
docker compose exec backend sh

# 进入前端容器
docker compose exec nginx sh

# 查看容器资源使用
docker stats
```

## 🔍 故障排除

### 端口冲突
如果遇到端口冲突，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
services:
  nginx:
    ports:
      - "3001:80"  # 改为其他端口
  mariadb:
    ports:
      - "3308:3306"  # 改为其他端口
```

### 数据库连接问题
```bash
# 检查数据库状态
docker compose logs mariadb

# 重启数据库
docker compose restart mariadb

# 检查数据库连接
docker compose exec backend ping mariadb
```

### 前端无法访问
```bash
# 检查Nginx状态
docker compose logs nginx

# 检查前端文件
docker compose exec nginx ls -la /usr/share/nginx/html

# 重启Nginx
docker compose restart nginx
```

## 📈 性能优化

### 生产环境配置
1. 修改 `docker-compose.yml` 中的环境变量
2. 使用外部数据库和Redis
3. 配置SSL证书
4. 启用Nginx缓存

### 监控
```bash
# 查看资源使用
docker stats

# 查看服务健康状态
curl http://localhost:8080/health

# 查看API响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/api/v1/words
```

## 🔐 安全配置

### 环境变量
确保在生产环境中修改以下敏感信息：
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 网络安全
- 使用防火墙限制端口访问
- 配置SSL/TLS证书
- 定期更新Docker镜像
- 监控异常访问

## 📝 日志管理

### 日志位置
- 应用日志: `docker compose logs`
- 数据库日志: `docker compose logs mariadb`
- Nginx日志: `docker compose logs nginx`

### 日志轮转
```bash
# 配置日志轮转
docker compose exec nginx logrotate /etc/logrotate.d/nginx
```

## 🚀 扩展部署

### 水平扩展
```bash
# 扩展后端服务
docker compose up -d --scale backend=3

# 使用负载均衡器
# 配置Nginx upstream
```

### 集群部署
- 使用Docker Swarm
- 使用Kubernetes
- 使用云服务商容器服务

## 📞 支持

如果遇到部署问题，请：
1. 查看日志: `docker compose logs`
2. 检查环境: `./test-docker.sh`
3. 提交Issue: [GitHub Issues](https://github.com/LJTian/LinguaForge/issues)
