const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    tables: []
  },
  onLoad: function() {
    console.log('papers.onLoad()')
    this.refreshPage()
  },
  onShow: function() {
    console.log('papers.onShow()')
    this.refreshPage()
  },
  onPullDownRefresh: function() {
    console.log('papers.onPullDownRefresh()')
    this.refreshPage()
    wx.stopPullDownRefresh();
  },
  refreshPage: function() {
    wx.showLoading({title: '正在查询文献列表……', mask: true})
    api.fetchPaperList((error, res) => {
      if (error) {
        wx.showToast({title: '查询文献列表失败', icon: 'none'})
        console.error('Fetch paper list failed:', error)
      } else {
        this.setData({tables: res.data.results})
      }
      wx.hideLoading()
    })
  }
})
