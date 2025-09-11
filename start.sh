#!/bin/bash

# LinguaForge 启动脚本

echo "🚀 启动 LinguaForge 项目..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查Docker Compose是否安装 (支持v1和v2)
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检测Docker Compose版本
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo "📦 使用 Docker Compose v1"
else
    COMPOSE_CMD="docker compose"
    echo "📦 使用 Docker Compose v2"
fi

echo "📦 构建并启动所有服务..."

# 停止现有容器
$COMPOSE_CMD down

# 构建并启动服务
$COMPOSE_CMD up --build -d

echo "⏳ 等待服务启动..."

# 等待数据库启动
sleep 10

# 检查服务状态
echo "📊 服务状态："
$COMPOSE_CMD ps

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
echo "   $COMPOSE_CMD logs -f"
echo ""
echo "🛑 停止服务："
echo "   $COMPOSE_CMD down"
