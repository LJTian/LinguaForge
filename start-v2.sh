#!/bin/bash

# LinguaForge 启动脚本 (Docker Compose v2)

echo "🚀 启动 LinguaForge 项目 (Docker Compose v2)..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查Docker Compose v2是否可用
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose v2 不可用，请确保安装了 Docker Compose v2"
    exit 1
fi

echo "📦 使用 Docker Compose v2 构建并启动所有服务..."

# 停止现有容器
docker compose down

# 构建并启动服务
docker compose up --build -d

echo "⏳ 等待服务启动..."

# 等待数据库启动
sleep 10

# 检查服务状态
echo "📊 服务状态："
docker compose ps

echo ""
echo "✅ LinguaForge 已启动！"
echo ""
echo "🌐 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端API: http://localhost:8080"
echo "   健康检查: http://localhost:8080/health"
echo "   数据库: localhost:3307"
echo ""
echo "📝 查看日志："
echo "   docker compose logs -f"
echo ""
echo "🛑 停止服务："
echo "   docker compose down"
echo ""
echo "🔧 其他常用命令："
echo "   重启服务: docker compose restart"
echo "   查看特定服务日志: docker compose logs -f backend"
echo "   进入容器: docker compose exec backend sh"
