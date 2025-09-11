#!/bin/bash

# Docker 环境测试脚本

echo "🐳 测试 Docker 环境..."

# 检查Docker是否运行
if docker info > /dev/null 2>&1; then
    echo "✅ Docker 正在运行"
    docker version --format "   Docker 版本: {{.Server.Version}}"
else
    echo "❌ Docker 未运行"
    exit 1
fi

# 检查Docker Compose v1
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose v1 可用"
    docker-compose --version
else
    echo "ℹ️  Docker Compose v1 不可用"
fi

# 检查Docker Compose v2
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose v2 可用"
    docker compose version
else
    echo "❌ Docker Compose v2 不可用"
    exit 1
fi

echo ""
echo "🧪 测试 Docker Compose 配置..."

# 验证docker-compose.yml文件
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml 文件存在"
    
    # 测试配置语法
    if docker compose config > /dev/null 2>&1; then
        echo "✅ Docker Compose 配置语法正确"
    else
        echo "❌ Docker Compose 配置语法错误"
        docker compose config
        exit 1
    fi
else
    echo "❌ docker-compose.yml 文件不存在"
    exit 1
fi

echo ""
echo "🚀 准备启动服务..."

# 检查端口占用
echo "🔍 检查端口占用情况..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  端口 3000 已被占用"
else
    echo "✅ 端口 3000 可用 (前端)"
fi

if lsof -i :8080 > /dev/null 2>&1; then
    echo "⚠️  端口 8080 已被占用"
else
    echo "✅ 端口 8080 可用 (后端API)"
fi

if lsof -i :3307 > /dev/null 2>&1; then
    echo "⚠️  端口 3307 已被占用"
else
    echo "✅ 端口 3307 可用 (数据库)"
fi

if lsof -i :6379 > /dev/null 2>&1; then
    echo "⚠️  端口 6379 已被占用"
else
    echo "✅ 端口 6379 可用 (Redis)"
fi

echo ""
echo "✅ Docker 环境测试完成！"
echo ""
echo "💡 现在可以运行以下命令启动项目："
echo "   ./start-v2.sh    # 使用 Docker Compose v2"
echo "   ./start.sh       # 自动检测版本"
