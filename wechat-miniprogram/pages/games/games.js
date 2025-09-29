// pages/games/games.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    dailyChallenges: [
      {
        id: 1,
        name: '单词达人',
        description: '学习10个新单词',
        icon: '📚',
        current: 3,
        target: 10,
        progress: 30,
        reward: 50
      },
      {
        id: 2,
        name: '游戏高手',
        description: '完成3局游戏',
        icon: '🎮',
        current: 1,
        target: 3,
        progress: 33,
        reward: 30
      },
      {
        id: 3,
        name: '连续学习',
        description: '连续学习7天',
        icon: '🔥',
        current: 4,
        target: 7,
        progress: 57,
        reward: 100
      }
    ],
    gameStats: {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0,
      streak: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadGameStats()
  },

  onShow() {
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.getUserInfo()
    this.setData({
      userInfo: userInfo
    })
  },

  // 加载游戏统计
  loadGameStats() {
    if (!app.isLoggedIn()) return

    wx.request({
      url: `${app.globalData.baseUrl}/game/stats`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            gameStats: res.data
          })
        }
      },
      fail: (err) => {
        console.error('加载游戏统计失败:', err)
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

  // 跳转到配音游戏
  goToDubbing() {
    if (!app.isLoggedIn()) {
      this.showLoginTip()
      return
    }
    wx.navigateTo({
      url: '/pages/dubbing/dubbing'
    })
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
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
