const app = getApp()

Page({
  data: {
    isLoading: true,
    nickname: '',
    isNicknameError: false,
    inputFocus: false
  },
  onLoad: function() {
    wx.showLoading({title: '正在载入……', mask: true})
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
              }
            }.bind(this),
            fail: function(error) {
              wx.showToast({title: 'Request failed', icon: 'none'});
              console.error('Request failed:', error);
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }.bind(this),
      complete: function() {
        this.setData({isLoading: false})
        wx.hideLoading()
      }.bind(this),
    })
  },
  onNicknameInput: function(e) {
    this.setData({nickname: e.detail.value})
  },
  onEnter: function() {
    if (this.data.nickname.trim() === '') {
      this.setData({isNicknameError: true})
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1500,
        complete: () => {this.setData({inputFocus: true});}
      })
    } else {
      this.setData({isNicknameError: false})
      console.log("Nickname: ", this.data.nickname)
    }
  }
})
