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
    wx.showLoading({title: '正在查询……', mask: true})
    api.fetchPaperList((error, res) => {
      if (error) {
        console.error('Fetch paper list failed:', error)
        wx.showModal({
          title: '查询失败',
          content: '无法获取文献列表\n' + error,
          showCancel: false,
        })
      } else {
        this.setData({tables: res.data.results})
      }
      wx.hideLoading()
    })
  }
})