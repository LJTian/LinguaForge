import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const DefenseGame: React.FC = () => {
  const { startGame, submitScore, isLoading } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [enemies, setEnemies] = useState([
    { id: 1, word: "Hello", position: 0, health: 50 },
    { id: 2, word: "World", position: 25, health: 50 },
    { id: 3, word: "Good", position: 50, health: 50 },
  ]);

  useEffect(() => {
    startGame('defense', 1);
  }, [startGame]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    // 模拟正确答案
    if (answer === "Hello") {
      setScore(score + 20);
      // 移除一个敌人
      setEnemies(prev => prev.slice(1));
    } else {
      setHealth(health - 10);
    }
  };

  const handleNextWave = () => {
    setWave(wave + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    // 生成新敌人
    setEnemies([
      { id: 1, word: "Beautiful", position: 0, health: 60 },
      { id: 2, word: "Amazing", position: 25, health: 60 },
      { id: 3, word: "Wonderful", position: 50, health: 60 },
    ]);
  };

  const handleFinishGame = async () => {
    await submitScore({
      game_type: 'defense',
      score: score,
      level_reached: wave,
      time_spent: 600, // 10分钟
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载游戏...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 游戏头部 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">词汇塔防</h1>
              <p className="text-gray-600">第 {wave} 波</p>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{score}</div>
                <div className="text-sm text-gray-600">分数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{health}</div>
                <div className="text-sm text-gray-600">生命值</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">防御战线</h2>
              
              {/* 敌人显示区域 */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6 h-32 relative">
                <div className="text-sm text-gray-600 mb-2">敌人进攻路线</div>
                {enemies.map((enemy) => (
                  <div
                    key={enemy.id}
                    className="absolute bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    style={{ left: `${enemy.position}%`, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    {enemy.word}
                  </div>
                ))}
              </div>

              {/* 防御塔区域 */}
              <div className="bg-blue-100 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">你的防御塔</div>
                <div className="flex space-x-4">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Grammar Tower
                  </div>
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Vocabulary Tower
                  </div>
                </div>
              </div>

              {/* 问题区域 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  选择正确的英语单词来攻击敌人：
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { word: "Hello", correct: true },
                    { word: "Hallo", correct: false },
                    { word: "World", correct: true },
                    { word: "Welt", correct: false },
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option.word)}
                      disabled={selectedAnswer !== null}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === option.word
                          ? option.correct
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-lg font-medium">{option.word}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 游戏状态 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">游戏状态</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">当前波次:</span>
                  <span className="font-semibold">{wave}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">剩余敌人:</span>
                  <span className="font-semibold">{enemies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">生命值:</span>
                  <span className="font-semibold text-red-600">{health}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">分数:</span>
                  <span className="font-semibold text-blue-600">{score}</span>
                </div>
              </div>
            </div>

            {/* 结果反馈 */}
            {showResult && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">攻击结果</h3>
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {selectedAnswer === "Hello" || selectedAnswer === "World" ? '🎯' : '💥'}
                  </div>
                  <p className="text-gray-600">
                    {selectedAnswer === "Hello" || selectedAnswer === "World" 
                      ? '命中！敌人被击败！' 
                      : '未命中！敌人继续前进！'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-3">
                <Link
                  to="/games"
                  className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                >
                  返回游戏选择
                </Link>
                
                {showResult && (
                  <button
                    onClick={enemies.length <= 1 ? handleNextWave : handleFinishGame}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {enemies.length <= 1 ? '下一波' : '完成游戏'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseGame;
