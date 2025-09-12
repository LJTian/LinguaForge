import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { WordWithProgress } from '../types';

const Words: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { user, isAuthenticated, setPreferredCategory } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.getCategories();
        setCategories(res.categories || []);
      } catch (e) {
        setError('加载分类失败');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      setError('');
      try {
        const effectiveCategory = activeCategory || user?.preferred_category || '';
        const res = await apiService.getWords({ category: effectiveCategory, limit: 50 });
        setWords(res.words || []);
      } catch (e) {
        setError('加载单词失败');
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [activeCategory, user?.preferred_category]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">词库</h2>

      {/* 分类选择 */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full border ${(activeCategory === '' && !user?.preferred_category) ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-blue-50'}`}
          onClick={() => setActiveCategory('')}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`px-3 py-1 rounded-full border ${(activeCategory || user?.preferred_category) === c ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-blue-50'}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {isAuthenticated && (
        <div>
          <button
            className="mt-2 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
            onClick={async () => {
              try {
                await setPreferredCategory(activeCategory);
                alert('已设为首选分类：' + (activeCategory || '全部'));
              } catch (e) {
                alert('设置失败');
              }
            }}
          >
            设为首选分类
          </button>
          {user?.preferred_category && (
            <span className="ml-3 text-sm text-gray-600">当前首选：{user.preferred_category}</span>
          )}
        </div>
      )}

      {/* 列表 */}
      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div className="text-gray-600">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((w) => (
            <div key={w.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold">{w.english}</div>
                <div className="text-sm text-gray-600">难度 {w.difficulty_level}</div>
              </div>
              <div className="text-gray-700 mb-2">{w.chinese}</div>
              {w.story && (
                <div className="text-sm text-gray-600 mb-2">{w.story}</div>
              )}
              {w.category && (
                <div className="text-sm text-blue-800">#{w.category}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Words;


