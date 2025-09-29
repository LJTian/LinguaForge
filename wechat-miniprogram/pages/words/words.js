// pages/words/words.js
const app = getApp()

Page({
  data: {
    words: [],
    searchKeyword: '',
    isLoading: false
  },

  onLoad() {
    this.loadWords()
  },

  loadWords() {
    this.setData({ isLoading: true })
    
    wx.request({
      url: `${app.globalData.baseUrl}/content/words`,
      method: 'GET',
      data: {
        keyword: this.data.searchKeyword,
        limit: 50
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            words: res.data.words || [],
            isLoading: false
          })
        }
      },
      fail: () => {
        this.setData({
          words: this.getMockWords(),
          isLoading: false
        })
      }
    })
  },

  getMockWords() {
    return [
      { id: 1, english: 'hello', chinese: '你好', pronunciation: '/həˈloʊ/' },
      { id: 2, english: 'world', chinese: '世界', pronunciation: '/wɜːrld/' },
      { id: 3, english: 'beautiful', chinese: '美丽的', pronunciation: '/ˈbjuːtɪfl/' }
    ]
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
    
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.loadWords()
    }, 500)
  },

  playAudio(e) {
    wx.showToast({
      title: '播放音频',
      icon: 'none'
    })
  }
})
