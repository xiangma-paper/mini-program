const app = getApp()

Page({
  data: {
    currentTab: 0,
    tabs: ["本月榜单", "上月榜单", "总榜单", "杂志榜单"],
    tables: []
  },
  onLoad: function () {
    wx.request({
      url: app.host + '/api/fetch_rank_list',
      success: (res) => {
        this.setData({tables: res.data.results})
      }
    })
  },
  switchTab: function (event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentTab: index })
  },
});
