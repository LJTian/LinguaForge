import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const AdventureGame: React.FC = () => {
  const { startGame, submitScore, isLoading } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    startGame('adventure', 1);
  }, [startGame]);

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    // 模拟正确答案
    if (optionId === 1) {
      setScore(score + 10);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
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
            <p className="text-lg text-gray-600 leading-relaxed">
              你是一个勇敢的探险家，正在探索神秘的英语森林。突然，你遇到了一个需要帮助的精灵。
              精灵说："如果你能帮我找到正确的英语单词，我就给你一个神奇的礼物！"
            </p>
          </div>

          {/* 问题区域 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              请选择正确的英语单词：
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 1, text: "Hello", correct: true },
                { id: 2, text: "Hallo", correct: false },
                { id: 3, text: "Hola", correct: false },
                { id: 4, text: "Bonjour", correct: false },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
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
                  <div className="text-sm text-gray-500">点击选择</div>
                </button>
              ))}
            </div>
          </div>

          {/* 反馈区域 */}
          {showFeedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {selectedOption === 1 ? '🎉' : '😔'}
                </span>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    {selectedOption === 1 ? '太棒了！' : '再试一次！'}
                  </h4>
                  <p className="text-blue-600">
                    {selectedOption === 1 
                      ? '你选择了正确的单词 "Hello"！精灵很高兴，给了你10分奖励。'
                      : '这个单词不是英语单词，请选择正确的英语单词。'
                    }
                  </p>
                </div>
              </div>
            </div>
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
                onClick={currentQuestion < 2 ? handleNextQuestion : handleFinishGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {currentQuestion < 2 ? '下一题' : '完成游戏'}
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
