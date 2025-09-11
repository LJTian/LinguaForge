#!/bin/bash

# LinguaForge API 测试脚本

API_BASE="http://localhost:8080/api/v1"

echo "🧪 测试 LinguaForge API..."

# 测试健康检查
echo "1. 测试健康检查..."
curl -s "http://localhost:8080/health" | jq '.' || echo "健康检查失败"

echo ""

# 测试用户注册
echo "2. 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "注册响应: $REGISTER_RESPONSE"

# 测试用户登录
echo ""
echo "3. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }')

echo "登录响应: $LOGIN_RESPONSE"

# 提取token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo ""
    echo "4. 测试获取用户资料..."
    PROFILE_RESPONSE=$(curl -s -X GET "$API_BASE/profile" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "用户资料: $PROFILE_RESPONSE"
    
    echo ""
    echo "5. 测试获取单词列表..."
    WORDS_RESPONSE=$(curl -s -X GET "$API_BASE/words?limit=5" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "单词列表: $WORDS_RESPONSE"
    
    echo ""
    echo "6. 测试获取排行榜..."
    LEADERBOARD_RESPONSE=$(curl -s -X GET "$API_BASE/leaderboard?limit=5" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "排行榜: $LEADERBOARD_RESPONSE"
else
    echo "❌ 登录失败，无法获取token"
fi

echo ""
echo "✅ API 测试完成！"
