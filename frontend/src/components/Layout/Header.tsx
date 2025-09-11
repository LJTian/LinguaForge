import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold">LinguaForge</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              首页
            </Link>
            <Link to="/games" className="hover:text-blue-200 transition-colors">
              游戏
            </Link>
            <Link to="/words" className="hover:text-blue-200 transition-colors">
              词库
            </Link>
            <Link to="/leaderboard" className="hover:text-blue-200 transition-colors">
              排行榜
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="text-sm">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-blue-200">
                      等级 {user?.level} | 经验 {user?.experience} | 金币 {user?.coins}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  登出
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
