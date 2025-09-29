// pages/adventure/adventure.js
const app = getApp()

Page({
  data: {
    gameStatus: 'ready', // ready, playing, finished
    currentLevel: 1,
    score: 0,
    lives: 3,
    coins: 0,
    isLoading: false,
    
    // 游戏数据
    words: [],
    currentWord: null,
    currentQuestionIndex: 0,
    totalQuestions: 10,
    options: [],
    selectedIndex: -1,
    correctIndex: -1,
    showResult: false,
    isLastQuestion: false,
    progressPercent: 0,
    
    // 游戏结果
    gameResult: {
      success: false,
      correctAnswers: 0,
      totalAnswers: 0
    },
    accuracy: 0,
    earnedCoins: 0,
    earnedExp: 0,
    hasNextLevel: true
  },

  onLoad(options) {
    // 获取关卡参数
    if (options.level) {
      this.setData({
        currentLevel: parseInt(options.level)
      })
    }
    
    this.loadGameData()
  },

  // 加载游戏数据
  loadGameData() {
    this.setData({ isLoading: true })
    
    wx.request({
      url: `${app.globalData.baseUrl}/content/words/random`,
      method: 'GET',
      data: {
        limit: this.data.totalQuestions,
        difficulty: this.data.currentLevel
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.words) {
          this.setData({
            words: res.data.words,
            isLoading: false
          })
        } else {
          // 使用模拟数据
          this.setData({
            words: this.getMockWords(),
            isLoading: false
          })
        }
      },
      fail: (err) => {
        console.error('加载游戏数据失败:', err)
        // 使用模拟数据
        this.setData({
          words: this.getMockWords(),
          isLoading: false
        })
      }
    })
  },

  // 获取模拟单词数据
  getMockWords() {
    return [
      { english: 'hello', chinese: '你好', pronunciation: '/həˈloʊ/' },
      { english: 'world', chinese: '世界', pronunciation: '/wɜːrld/' },
      { english: 'beautiful', chinese: '美丽的', pronunciation: '/ˈbjuːtɪfl/' },
      { english: 'adventure', chinese: '冒险', pronunciation: '/ədˈventʃər/' },
      { english: 'learning', chinese: '学习', pronunciation: '/ˈlɜːrnɪŋ/' },
      { english: 'practice', chinese: '练习', pronunciation: '/ˈpræktɪs/' },
      { english: 'vocabulary', chinese: '词汇', pronunciation: '/vəˈkæbjələri/' },
      { english: 'grammar', chinese: '语法', pronunciation: '/ˈɡræmər/' },
      { english: 'pronunciation', chinese: '发音', pronunciation: '/prəˌnʌnsiˈeɪʃn/' },
      { english: 'conversation', chinese: '对话', pronunciation: '/ˌkɑːnvərˈseɪʃn/' }
    ]
  },

  // 开始游戏
  startGame() {
    if (this.data.words.length === 0) {
      wx.showToast({
        title: '游戏数据加载失败',
        icon: 'none'
      })
      return
    }

    this.setData({
      gameStatus: 'playing',
      currentQuestionIndex: 0,
      score: 0,
      lives: 3,
      coins: 0,
      gameResult: {
        success: false,
        correctAnswers: 0,
        totalAnswers: 0
      }
    })

    this.loadQuestion()
  },

  // 加载题目
  loadQuestion() {
    const { words, currentQuestionIndex, totalQuestions } = this.data
    
    if (currentQuestionIndex >= totalQuestions || currentQuestionIndex >= words.length) {
      this.finishGame()
      return
    }

    const currentWord = words[currentQuestionIndex]
    const options = this.generateOptions(currentWord)
    const correctIndex = options.indexOf(currentWord.chinese)
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    this.setData({
      currentWord,
      options,
      correctIndex,
      selectedIndex: -1,
      showResult: false,
      progressPercent,
      isLastQuestion
    })
  },

  // 生成选项
  generateOptions(correctWord) {
    const { words } = this.data
    const options = [correctWord.chinese]
    
    // 随机选择3个错误选项
    const otherWords = words.filter(word => word.chinese !== correctWord.chinese)
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
      options.push(shuffledOthers[i].chinese)
    }
    
    // 如果选项不够4个，添加一些通用错误选项
    const genericOptions = ['苹果', '汽车', '房子', '书本', '电脑', '音乐', '电影', '朋友']
    while (options.length < 4) {
      const randomOption = genericOptions[Math.floor(Math.random() * genericOptions.length)]
      if (!options.includes(randomOption)) {
        options.push(randomOption)
      }
    }
    
    // 打乱选项顺序
    return options.sort(() => Math.random() - 0.5)
  },

  // 选择选项
  selectOption(e) {
    if (this.data.showResult) return
    
    const selectedIndex = parseInt(e.currentTarget.dataset.index)
    const { correctIndex } = this.data
    const isCorrect = selectedIndex === correctIndex
    
    let { score, lives, coins, gameResult } = this.data
    
    if (isCorrect) {
      score += 100
      coins += 10
      gameResult.correctAnswers++
    } else {
      lives--
    }
    
    gameResult.totalAnswers++
    
    this.setData({
      selectedIndex,
      showResult: true,
      score,
      lives,
      coins,
      gameResult
    })

    // 如果生命值为0，游戏结束
    if (lives <= 0) {
      setTimeout(() => {
        this.finishGame()
      }, 1500)
    }
  },

  // 下一题
  nextQuestion() {
    const { currentQuestionIndex, totalQuestions } = this.data
    
    if (currentQuestionIndex >= totalQuestions - 1) {
      this.finishGame()
    } else {
      this.setData({
        currentQuestionIndex: currentQuestionIndex + 1
      })
      this.loadQuestion()
    }
  },

  // 完成游戏
  finishGame() {
    const { gameResult, score, coins } = this.data
    const accuracy = gameResult.totalAnswers > 0 ? 
      Math.round((gameResult.correctAnswers / gameResult.totalAnswers) * 100) : 0
    
    const success = gameResult.correctAnswers >= gameResult.totalAnswers * 0.6 // 60%正确率通关
    const earnedCoins = coins
    const earnedExp = Math.floor(score / 10)
    
    this.setData({
      gameStatus: 'finished',
      accuracy,
      earnedCoins,
      earnedExp,
      'gameResult.success': success
    })

    // 如果登录了，保存游戏记录
    if (app.isLoggedIn()) {
      this.saveGameRecord()
    }
  },

  // 保存游戏记录
  saveGameRecord() {
    const { currentLevel, score, accuracy, earnedCoins, earnedExp } = this.data
    
    wx.request({
      url: `${app.globalData.baseUrl}/game/record`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      data: {
        game_type: 'adventure',
        level: currentLevel,
        score: score,
        accuracy: accuracy,
        coins_earned: earnedCoins,
        exp_earned: earnedExp
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('游戏记录保存成功')
        }
      },
      fail: (err) => {
        console.error('保存游戏记录失败:', err)
      }
    })
  },

  // 重新开始
  restartGame() {
    this.setData({
      gameStatus: 'ready'
    })
  },

  // 下一关卡
  nextLevel() {
    const nextLevel = this.data.currentLevel + 1
    this.setData({
      currentLevel: nextLevel,
      gameStatus: 'ready'
    })
    this.loadGameData()
  },

  // 返回游戏列表
  backToGames() {
    wx.navigateBack()
  }
})
