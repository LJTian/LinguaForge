import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { apiService } from '../../services/api';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, setPreferredCategory } = useAuthStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // 取分类列表
    apiService
      .getCategories()
      .then((res) => setCategories(res.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedCategory(user?.preferred_category || '');
  }, [user?.preferred_category]);

  return (
    <header className="site-header bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-white">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-white">LinguaForge</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-white">
            <Link to="/" className="text-white hover:text-white font-medium transition-colors">
              首页
            </Link>
            <Link to="/games" className="text-white hover:text-white font-medium transition-colors">
              游戏
            </Link>
            <Link to="/words" className="text-white hover:text-white font-medium transition-colors">
              词库
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-white font-medium transition-colors">
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
                    <div className="text-white/90">
                      等级 {user?.level} | 经验 {user?.experience} | 金币 {user?.coins}
                    </div>
                    {(
                      <div className="text-white/90 flex items-center gap-2 mt-1">
                        <span>首选分类：</span>
                        <select
                          className="text-blue-700 rounded px-2 py-1 text-xs"
                          value={selectedCategory}
                          onChange={async (e) => {
                            const value = e.target.value;
                            setSelectedCategory(value);
                            // 确保后端已保存，游戏开始时即可按分类取词
                            try {
                              await setPreferredCategory(value);
                            } catch {
                              // ignore
                            }
                          }}
                        >
                          <option value="">全部</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
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
