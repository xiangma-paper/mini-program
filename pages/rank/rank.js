const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    currentTab: 0,
    tabs: ["本月榜单", "上月榜单", "总榜单", "杂志榜单"],
    tables: []
  },
  onLoad: function () {
    console.log('rank.onLoad()')
    this.refreshPage()
  },
  onShow: function() {
    console.log('rank.onShow()')
    this.refreshPage()
  },
  onPullDownRefresh: function() {
    console.log('rank.onPullDownRefresh()')
    this.refreshPage()
    wx.stopPullDownRefresh();
  },
  refreshPage: function() {
    api.fetchRankList((error, res) => {
      if (error) {
        wx.showToast({title: '载入榜单失败', icon: 'none'})
        console.error('Fetch rank list failed:', error)
      } else {
        console.log(res)
        this.setData({tables: res.data.results})
      }
    })
  },
  switchTab: function (event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentTab: index })
  },
});
