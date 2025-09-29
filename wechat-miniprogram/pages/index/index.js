// pages/index/index.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    recommendedWords: [],
    todayWordsLearned: 0,
    todayWordsTarget: 10,
    todayProgress: 0
  },

  onLoad() {
    this.loadUserInfo()
    this.loadRecommendedWords()
  },

  onShow() {
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.getUserInfo()
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      this.calculateProgress()
    }
  },

  // 计算今日学习进度
  calculateProgress() {
    // 这里可以调用API获取真实的学习进度
    const progress = Math.min((this.data.todayWordsLearned / this.data.todayWordsTarget) * 100, 100)
    this.setData({
      todayProgress: progress
    })
  },

  // 加载推荐单词
  loadRecommendedWords() {
    wx.request({
      url: `${app.globalData.baseUrl}/content/words/random`,
      method: 'GET',
      data: {
        limit: 3
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.words) {
          this.setData({
            recommendedWords: res.data.words
          })
        }
      },
      fail: (err) => {
        console.error('加载推荐单词失败:', err)
      }
    })
  },

  // 跳转到冒险游戏
  goToAdventure() {
    if (!app.isLoggedIn()) {
      this.showLoginTip()
      return
    }
    wx.navigateTo({
      url: '/pages/adventure/adventure'
    })
  },

  // 跳转到防御游戏
  goToDefense() {
    if (!app.isLoggedIn()) {
      this.showLoginTip()
      return
    }
    wx.navigateTo({
      url: '/pages/defense/defense'
    })
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  // 显示登录提示
  showLoginTip() {
    wx.showModal({
      title: '提示',
      content: '请先登录才能开始游戏',
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.goToLogin()
        }
      }
    })
  }
})
