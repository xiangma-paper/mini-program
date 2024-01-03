const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    currentTab: 0,
    tabs: ["全部", "本月", "上月", "我的"],
    papers: []
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
    this.fetchPaperList(this.data.currentTab)
      .then(res => {
        this.setData({papers: res.data.results})
        wx.hideLoading()
      })
      .catch(error => {
        wx.hideLoading()
        console.error('Fetch paper list failed:', error)
        wx.showModal({
          title: '查询失败',
          content: '无法获取文献列表\n' + error,
          showCancel: false,
        })
      })
  },
  fetchPaperList: function(mode) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/fetch_paper_list',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {
          token: app.token,
          mode: mode,
          group_name: 'xiangma'
        },
        success: resolve,
        fail: reject
      })
    })
  },
  switchTab: function (event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentTab: index })
    this.refreshPage()
  }
})