import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          欢迎来到 <span className="text-blue-600">LinguaForge</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          通过游戏化的方式学习英语，让学习变得有趣而高效。体验故事冒险、词汇塔防和互动配音三大游戏模式。
        </p>
        
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              欢迎回来，{user?.username}！
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user?.level}</div>
                <div className="text-sm text-gray-600">等级</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user?.experience}</div>
                <div className="text-sm text-gray-600">经验</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{user?.coins}</div>
                <div className="text-sm text-gray-600">金币</div>
              </div>
            </div>
            <Link
              to="/games"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
            >
              开始游戏
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              立即注册
            </Link>
            <Link
              to="/login"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              登录
            </Link>
          </div>
        )}
      </div>

      {/* Game Features */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">故事冒险</h3>
          <p className="text-gray-600 mb-4">
            在有趣的故事情节中学习英语，通过选择正确的单词和语法来推进剧情发展。
          </p>
          <Link
            to="/games/adventure"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            开始冒险 →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏰</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">词汇塔防</h3>
          <p className="text-gray-600 mb-4">
            建造防御塔来抵御错误词汇的进攻，通过正确回答问题来升级你的防御。
          </p>
          <Link
            to="/games/defense"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            开始防御 →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎤</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">互动配音</h3>
          <p className="text-gray-600 mb-4">
            为电影片段配音，练习发音和语调，AI会评估你的发音准确性。
          </p>
          <Link
            to="/games/dubbing"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            开始配音 →
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          为什么选择 LinguaForge？
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🎮</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">游戏化学习</h4>
            <p className="text-sm text-gray-600">通过游戏让学习变得有趣</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">进度追踪</h4>
            <p className="text-sm text-gray-600">实时跟踪学习进度和成就</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🏆</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">排行榜</h4>
            <p className="text-sm text-gray-600">与全球玩家竞争排名</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">个性化</h4>
            <p className="text-sm text-gray-600">根据水平调整难度</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
