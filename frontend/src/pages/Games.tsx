import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/api';

const Games: React.FC = () => {
  const { user, setPreferredCategory } = useAuthStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(user?.preferred_category || '');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.getCategories();
        setCategories(res.categories || []);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(user?.preferred_category || '');
  }, [user?.preferred_category]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          选择游戏模式
        </h1>
        <p className="text-xl text-gray-600">
          欢迎 {user?.username}，选择你喜欢的游戏开始学习吧！
        </p>
        {user?.preferred_category && (
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            当前首选分类：{user.preferred_category}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 故事冒险游戏 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">故事冒险</h3>
            <p className="text-purple-100">
              在有趣的故事情节中学习英语，通过选择正确的单词和语法来推进剧情发展。
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>难度等级:</span>
              <span>⭐ ⭐ ⭐</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>预计时间:</span>
              <span>10-15分钟</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>奖励经验:</span>
              <span>50-100 XP</span>
            </div>
          </div>
          <Link
            to="/games/adventure"
            className="block w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-lg text-center mt-6 hover:bg-purple-50 transition-colors"
          >
            开始冒险
          </Link>
        </div>

        {/* 词汇塔防游戏 */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏰</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">词汇塔防</h3>
            <p className="text-red-100">
              建造防御塔来抵御错误词汇的进攻，通过正确回答问题来升级你的防御。
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>难度等级:</span>
              <span>⭐ ⭐ ⭐ ⭐</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>预计时间:</span>
              <span>15-20分钟</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>奖励经验:</span>
              <span>80-150 XP</span>
            </div>
          </div>
          <Link
            to="/games/defense"
            className="block w-full bg-white text-red-700 font-semibold py-3 px-6 rounded-lg text-center mt-6 hover:bg-red-50 transition-colors"
          >
            开始防御
          </Link>
        </div>

        {/* 互动配音游戏 */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎤</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">互动配音</h3>
            <p className="text-green-100">
              为电影片段配音，练习发音和语调，AI会评估你的发音准确性。
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>难度等级:</span>
              <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>预计时间:</span>
              <span>5-10分钟</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>奖励经验:</span>
              <span>30-80 XP</span>
            </div>
          </div>
          <Link
            to="/games/dubbing"
            className="block w-full bg-white text-green-700 font-semibold py-3 px-6 rounded-lg text-center mt-6 hover:bg-green-50 transition-colors"
          >
            开始配音
          </Link>
        </div>
      </div>

      {/* 用户统计 */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">你的学习统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{user?.level || 1}</div>
            <div className="text-sm text-gray-600">当前等级</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{user?.experience || 0}</div>
            <div className="text-sm text-gray-600">总经验</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{user?.coins || 0}</div>
            <div className="text-sm text-gray-600">金币</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">游戏次数</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
