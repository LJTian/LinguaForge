// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    achievements: [],
    streak: 0,
    rank: 0,
    expProgress: 0,
    nextLevelExp: 1000,
    categories: ['日常对话', '商务英语', '旅游英语', '学术英语', '考试英语'],
    categoryIndex: 0,
    reminderEnabled: true,
    soundEnabled: true
  },

  onLoad() {
    this.loadUserInfo()
    this.loadUserStats()
    this.loadAchievements()
    this.loadPreferences()
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
      this.calculateExpProgress()
    }
  },

  // 计算经验进度
  calculateExpProgress() {
    const { experience, level } = this.data.userInfo
    const currentLevelExp = (level - 1) * 1000
    const nextLevelExp = level * 1000
    const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100
    
    this.setData({
      expProgress: Math.max(0, Math.min(100, progress)),
      nextLevelExp: nextLevelExp
    })
  },

  // 加载用户统计
  loadUserStats() {
    if (!app.isLoggedIn()) return

    wx.request({
      url: `${app.globalData.baseUrl}/user/stats`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            streak: res.data.streak || 0,
            rank: res.data.rank || 0
          })
        }
      },
      fail: (err) => {
        console.error('加载用户统计失败:', err)
      }
    })
  },

  // 加载成就
  loadAchievements() {
    if (!app.isLoggedIn()) return

    // 模拟成就数据
    this.setData({
      achievements: [
        {
          id: 1,
          name: '初学者',
          description: '完成第一个游戏',
          icon: '🎯',
          earnedAt: '2024-01-15'
        },
        {
          id: 2,
          name: '单词达人',
          description: '学习100个单词',
          icon: '📚',
          earnedAt: '2024-01-20'
        },
        {
          id: 3,
          name: '坚持不懈',
          description: '连续学习7天',
          icon: '🔥',
          earnedAt: '2024-01-25'
        }
      ]
    })
  },

  // 加载偏好设置
  loadPreferences() {
    const preferences = wx.getStorageSync('preferences') || {}
    this.setData({
      categoryIndex: preferences.categoryIndex || 0,
      reminderEnabled: preferences.reminderEnabled !== false,
      soundEnabled: preferences.soundEnabled !== false
    })
  },

  // 保存偏好设置
  savePreferences() {
    const { categoryIndex, reminderEnabled, soundEnabled } = this.data
    wx.setStorageSync('preferences', {
      categoryIndex,
      reminderEnabled,
      soundEnabled
    })
  },

  // 分类选择改变
  onCategoryChange(e) {
    this.setData({
      categoryIndex: parseInt(e.detail.value)
    })
    this.savePreferences()
    
    // 更新服务器偏好
    this.updateServerPreferences()
  },

  // 提醒开关改变
  onReminderChange(e) {
    this.setData({
      reminderEnabled: e.detail.value
    })
    this.savePreferences()
  },

  // 音效开关改变
  onSoundChange(e) {
    this.setData({
      soundEnabled: e.detail.value
    })
    this.savePreferences()
  },

  // 更新服务器偏好
  updateServerPreferences() {
    if (!app.isLoggedIn()) return

    const category = this.data.categories[this.data.categoryIndex]
    wx.request({
      url: `${app.globalData.baseUrl}/user/profile`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      data: {
        preferred_category: category
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('偏好更新成功')
        }
      },
      fail: (err) => {
        console.error('偏好更新失败:', err)
      }
    })
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 查看全部成就
  viewAllAchievements() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看成就
  viewAchievements() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看历史
  viewHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看设置
  viewSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 联系客服
  contactSupport() {
    wx.showModal({
      title: '联系客服',
      content: '如有问题请联系客服微信：linguaforge_support',
      showCancel: false
    })
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于 LinguaForge',
      content: 'LinguaForge 是一个有趣的英语学习平台，通过游戏化的方式让英语学习变得更加有趣。\n\n版本：v1.0.0',
      showCancel: false
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({
            userInfo: null
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
