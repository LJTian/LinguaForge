// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:8080/api/v1'
  },

  onLaunch() {
    // 检查登录状态
    this.checkLogin()
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      // 验证token是否有效
      this.validateToken()
    }
  },

  // 验证token
  validateToken() {
    wx.request({
      url: `${this.globalData.baseUrl}/user/profile`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${this.globalData.token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.userInfo = res.data
        } else {
          // token无效，清除本地存储
          this.logout()
        }
      },
      fail: () => {
        this.logout()
      }
    })
  },

  // 登录
  login(username, password, callback) {
    wx.request({
      url: `${this.globalData.baseUrl}/auth/login`,
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.token = res.data.token
          this.globalData.userInfo = res.data.user
          wx.setStorageSync('token', res.data.token)
          callback && callback(true, res.data)
        } else {
          callback && callback(false, res.data.error || '登录失败')
        }
      },
      fail: (err) => {
        callback && callback(false, '网络请求失败')
      }
    })
  },

  // 注册
  register(username, email, password, callback) {
    wx.request({
      url: `${this.globalData.baseUrl}/auth/register`,
      method: 'POST',
      data: {
        username: username,
        email: email,
        password: password
      },
      success: (res) => {
        if (res.statusCode === 201) {
          callback && callback(true, res.data)
        } else {
          callback && callback(false, res.data.error || '注册失败')
        }
      },
      fail: (err) => {
        callback && callback(false, '网络请求失败')
      }
    })
  },

  // 登出
  logout() {
    this.globalData.token = null
    this.globalData.userInfo = null
    wx.removeStorageSync('token')
  },

  // 检查是否已登录
  isLoggedIn() {
    return !!this.globalData.token
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo
  }
})
