const app = getApp()

Page({
  data: {
    nickname: '',
    papers: []
  },
  onLoad: function() {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: app.host + '/api/wx_login',
            method: 'POST',
            data: {code: res.code},
            success: function(res) {
              console.log(res)
              if (res.data.success) {
                this.setData({nickname: res.data.nickname})
                this.setData({papers: res.data.papers})
              }
            }.bind(this)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }.bind(this)
    })
  },
});
