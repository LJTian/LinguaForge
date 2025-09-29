// pages/login/login.js
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    isLoading: false
  },

  onLoad() {
    // 如果已经登录，直接跳转到首页
    if (app.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 处理登录
  handleLogin() {
    const { username, password } = this.data

    // 表单验证
    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    this.setData({ isLoading: true })

    // 调用登录API
    app.login(username, password, (success, data) => {
      this.setData({ isLoading: false })

      if (success) {
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: data || '登录失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  // 快速体验
  quickStart() {
    wx.switchTab({
      url: '/pages/games/games'
    })
  }
})
