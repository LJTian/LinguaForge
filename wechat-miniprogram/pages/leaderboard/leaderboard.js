// pages/leaderboard/leaderboard.js
const app = getApp()

Page({
  data: {
    currentTab: 'score',
    rankings: [],
    myRank: null,
    isLoading: false
  },

  onLoad() {
    this.loadRankings()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    })
    this.loadRankings()
  },

  loadRankings() {
    this.setData({ isLoading: true })

    wx.request({
      url: `${app.globalData.baseUrl}/leaderboard`,
      method: 'GET',
      data: {
        type: this.data.currentTab,
        limit: 50
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            rankings: res.data.rankings || [],
            myRank: res.data.myRank || null,
            isLoading: false
          })
        }
      },
      fail: () => {
        // 使用模拟数据
        this.setData({
          rankings: this.getMockRankings(),
          myRank: { rank: 15, score: 850, level: 5 },
          isLoading: false
        })
      }
    })
  },

  getMockRankings() {
    return [
      { id: 1, rank: 1, username: 'Alice', level: 10, score: 2500 },
      { id: 2, rank: 2, username: 'Bob', level: 9, score: 2200 },
      { id: 3, rank: 3, username: 'Charlie', level: 8, score: 1950 },
      { id: 4, rank: 4, username: 'David', level: 8, score: 1800 },
      { id: 5, rank: 5, username: 'Eve', level: 7, score: 1650 }
    ]
  }
})
