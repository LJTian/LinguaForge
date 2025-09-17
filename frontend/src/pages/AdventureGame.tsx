import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import type { AdventureGame as AdventureGameType, AdventureOption } from '../types';

const AdventureGame: React.FC = () => {
  const { startGame, submitScore, isLoading, currentGame } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);

  useEffect(() => {
    startGame('adventure', 1);
  }, [startGame]);

  // Compute game/rounds and memoized story before any early return to keep hooks order consistent
  const game = (currentGame as AdventureGameType) || null;
  const totalRounds = game?.rounds?.length || 1;
  const options: AdventureOption[] = (game?.rounds && game.rounds[roundIndex]?.options) || game?.options || [];
  const storyRaw = (game?.rounds && game.rounds[roundIndex]?.story) || game?.story || '加载故事中...';
  const correctText = useMemo(() => options.find(o => o.correct)?.text || '', [options]);

  const correctChinese = useMemo(() => {
    if (!correctText) return '';
    const english = correctText;
    const found = game?.words?.find(w => w.english === english)
      || game?.words?.find(w => w.english?.toLowerCase?.() === english?.toLowerCase?.());
    return found?.chinese || '';
  }, [game, correctText]);

  const optionChineseList = useMemo(() => {
    return options.map(o => {
      const english = o.text;
      const found = game?.words?.find(w => w.english === english)
        || game?.words?.find(w => w.english?.toLowerCase?.() === english?.toLowerCase?.());
      return { id: o.id, chinese: found?.chinese || '' };
    });
  }, [options, game]);

  const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string));

  const storyHtml = useMemo(() => {
    // 优先在故事中加粗中文关键词；若不存在再尝试加粗英文；都不存在则在末尾追加中文关键词
    const tryBold = (src: string, keyword: string) => {
      if (!keyword) return src;
      const escapedForRegex = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedForRegex})`, 'i');
      return src.replace(regex, '<strong class="text-gray-900">$1</strong>');
    };

    let replaced = storyRaw;
    if (correctChinese) {
      const newText = tryBold(replaced, correctChinese);
      if (newText !== replaced) return newText;
    }
    if (correctText) {
      const escapedForRegex = correctText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(\\b${escapedForRegex}\\b)`, 'i');
      const newText = replaced.replace(regex, '<strong class="text-gray-900">$1</strong>');
      if (newText !== replaced) return newText;
    }
    const safeZh = escapeHtml(correctChinese || '');
    return `${replaced} （关键词：<strong class="text-gray-900">${safeZh}</strong>）`;
  }, [storyRaw, correctChinese, correctText]);

  const handleOptionSelect = (optionId: number, correct: boolean) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    if (correct) {
      setScore(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setRoundIndex((idx) => Math.min(idx + 1, totalRounds - 1));
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleFinishGame = async () => {
    await submitScore({
      game_type: 'adventure',
      score: score,
      level_reached: 1,
      time_spent: 300, // 5分钟
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载游戏...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 游戏头部 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">故事冒险</h1>
              <p className="text-gray-600">第 {currentQuestion + 1} 关</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">分数</div>
            </div>
          </div>
        </div>

        {/* 游戏内容 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">神秘的英语森林</h2>
            <p className="text-lg text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: storyHtml }}></p>
          </div>

          {/* 问题区域 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              请选择正确的英语单词：
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id, option.correct)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? option.correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-lg font-medium">{option.text}</div>
                  <div className="text-sm text-gray-500">{showFeedback ? (optionChineseList.find(i => i.id === option.id)?.chinese || '（无中文）') : '点击选择'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 反馈区域 */}
          {showFeedback && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{options.find(o => o.id === selectedOption)?.correct ? '🎉' : '😔'}</span>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      {options.find(o => o.id === selectedOption)?.correct ? '太棒了！' : '再试一次！'}
                    </h4>
                    <p className="text-blue-600">
                      {options.find(o => o.id === selectedOption)?.correct ? '回答正确！你获得了10分奖励。' : '别灰心，继续加油！'}
                    </p>
                  </div>
                </div>
              </div>

              
            </>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-between">
            <Link
              to="/games"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              返回游戏选择
            </Link>
            
            {showFeedback && (
              <button
                onClick={roundIndex < (totalRounds - 1) ? handleNextQuestion : handleFinishGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {roundIndex < (totalRounds - 1) ? '下一题' : '完成游戏'}
              </button>
            )}
          </div>
        </div>

        {/* 游戏提示 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800">游戏提示</h4>
              <p className="text-yellow-700">
                选择正确的英语单词来帮助精灵。每答对一题都会获得分数奖励！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureGame;
