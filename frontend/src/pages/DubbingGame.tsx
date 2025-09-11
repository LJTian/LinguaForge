import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

const DubbingGame: React.FC = () => {
  const { startGame, submitDubbing, isLoading } = useGameStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [currentScript, setCurrentScript] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const scripts = [
    {
      id: 1,
      character: "Hero",
      text: "Hello, my name is Alex. I'm here to help you learn English!",
      audioUrl: "/audio/hero_hello.mp3"
    },
    {
      id: 2,
      character: "Hero", 
      text: "Let's practice some vocabulary together.",
      audioUrl: "/audio/hero_vocab.mp3"
    }
  ];

  useEffect(() => {
    startGame('dubbing', 1);
  }, [startGame]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // 模拟录音过程
    setTimeout(() => {
      setIsRecording(false);
      setRecordedAudio("recorded_audio_data");
    }, 3000);
  };

  const handleSubmitRecording = async () => {
    setShowResult(true);
    // 模拟AI评分
    const aiScore = Math.floor(Math.random() * 40) + 60; // 60-100分
    setScore(aiScore);
    
    await submitDubbing({
      scene_id: 1,
      script_id: scripts[currentScript].id,
      audio_data: recordedAudio || "",
      time_spent: 30
    });
  };

  const handleNextScript = () => {
    if (currentScript < scripts.length - 1) {
      setCurrentScript(currentScript + 1);
      setRecordedAudio(null);
      setShowResult(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载游戏...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 游戏头部 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">互动配音</h1>
              <p className="text-gray-600">第 {currentScript + 1} 段对话</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">发音评分</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：脚本和录音区域 */}
          <div className="space-y-6">
            {/* 脚本显示 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">配音脚本</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2">角色: {scripts[currentScript].character}</div>
                <div className="text-lg text-gray-800 leading-relaxed">
                  "{scripts[currentScript].text}"
                </div>
              </div>
              
              {/* 播放原音按钮 */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-4">
                🔊 播放原音
              </button>
            </div>

            {/* 录音区域 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">开始录音</h3>
              
              {!recordedAudio ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎤</span>
                  </div>
                  <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-500 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isRecording ? '录音中...' : '开始录音'}
                  </button>
                  {isRecording && (
                    <div className="mt-4">
                      <div className="animate-pulse text-red-600">● 正在录音...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✅</span>
                  </div>
                  <p className="text-green-600 mb-4">录音完成！</p>
                  <div className="space-y-2">
                    <button
                      onClick={handleSubmitRecording}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      提交录音
                    </button>
                    <button
                      onClick={() => {
                        setRecordedAudio(null);
                        setShowResult(false);
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      重新录音
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：结果和操作区域 */}
          <div className="space-y-6">
            {/* 评分结果 */}
            {showResult && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">AI评分结果</h3>
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">{score}</div>
                  <div className="text-gray-600 mb-4">发音准确度</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>发音清晰度:</span>
                      <span className="font-semibold">{Math.floor(score * 0.8)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>语调准确性:</span>
                      <span className="font-semibold">{Math.floor(score * 0.9)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>语速控制:</span>
                      <span className="font-semibold">{Math.floor(score * 0.7)}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm">
                      {score >= 90 ? '太棒了！你的发音非常标准！' :
                       score >= 80 ? '很好！发音基本准确，继续练习！' :
                       score >= 70 ? '不错！还有提升空间，加油！' :
                       '需要多练习，建议多听原音模仿。'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 游戏进度 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">游戏进度</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">当前对话:</span>
                  <span className="font-semibold">{currentScript + 1} / {scripts.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentScript + 1) / scripts.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-3">
                <Link
                  to="/games"
                  className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                >
                  返回游戏选择
                </Link>
                
                {showResult && currentScript < scripts.length - 1 && (
                  <button
                    onClick={handleNextScript}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    下一段对话
                  </button>
                )}
                
                {showResult && currentScript === scripts.length - 1 && (
                  <button
                    onClick={() => {
                      // 完成游戏
                      setCurrentScript(0);
                      setRecordedAudio(null);
                      setShowResult(false);
                      setScore(0);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    重新开始
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 游戏提示 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800">配音技巧</h4>
              <p className="text-yellow-700">
                仔细听原音，注意发音、语调和语速。录音时保持清晰，不要紧张，多练习几次效果会更好！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DubbingGame;
