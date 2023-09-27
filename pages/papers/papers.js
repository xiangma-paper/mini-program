const app = getApp()

Page({
  data: {
    tables: []
  },
  onLoad: function() {
    wx.request({
      url: app.host + '/api/fetch_paper_list',
      success: (res) => {
        this.setData({tables: res.data.results})
      }
    })
  },
})