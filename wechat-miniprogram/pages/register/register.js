// pages/register/register.js
const app = getApp()

Page({
  data: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  // 邮箱输入
  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  // 验证邮箱格式
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 处理注册
  handleRegister() {
    const { username, email, password, confirmPassword } = this.data

    // 表单验证
    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (username.trim().length < 3) {
      wx.showToast({
        title: '用户名至少3个字符',
        icon: 'none'
      })
      return
    }

    if (!email.trim()) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      })
      return
    }

    if (!this.validateEmail(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
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

    if (password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }

    this.setData({ isLoading: true })

    // 调用注册API
    app.register(username, email, password, (success, data) => {
      this.setData({ isLoading: false })

      if (success) {
        wx.showModal({
          title: '注册成功',
          content: '账号创建成功，请登录使用',
          showCancel: false,
          success: () => {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        })
      } else {
        wx.showToast({
          title: data || '注册失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateBack()
  }
})
