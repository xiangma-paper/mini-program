const app = getApp()

Page({
  data: {
    nicknameButtonStyle: 'display:none;',
    nickname: '',
    nicknameInputing: '',
    paperId: '',
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
  onNicknameChanged: function(e) {
    this.data.nicknameInputing = e.detail.value;
  },
  onNicknameFocus: function(e) {
    this.setData({nicknameButtonStyle: 'display:block;'})
  },
  onNicknameSubmit: function(e) {
    console.log('nickname: "' + this.data.nickname + '" => "' + this.data.nicknameInputing + '"')
    if (this.data.nicknameInputing.trim() === '') {
      wx.showToast({title: '昵称不能为空', icon: 'none', duration: 1500});
      this.setFocusOnInput();
      return;
    }
    this.setData({nickname: this.data.nicknameInputing})
    this.setData({nicknameButtonStyle: 'display:none;'})
  },
  setFocusOnInput: function() {
    const query = wx.createSelectorQuery();
    query.select('#nickname-input').focus();
  },
  onPaperIdChanged: function(e) {
    this.data.paperId = e.detail.value
  },
  onSearch: function() {
    console.log('paperId:', this.data.paperId)
  }
})
