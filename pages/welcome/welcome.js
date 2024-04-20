const app = getApp();

Page({
  data: {
    isLoading: true,
    nickname: '',
    isNicknameError: false,
    inputFocus: false,
  },
  onLoad: function() {
    // 登录
    wx.showLoading({title: '正在启动……'});
    wx.login({
      success: res => {
        wx.request({
          url: app.host + '/api/wx_login',
          method: 'POST',
          data: {code: res.code},
          success: res => {
            if (res.data.success) {
              console.log(res.data);
              app.token = res.data.token;
              app.csrfToken = res.data.csrfToken;
              app.nickname = res.data.nickname;
              if (app.nickname != '') {
                this.gotoNextPage();
              } else {
                this.setData({isLoading: false, nickname: app.nickname});
              }
            }
          }
        })
      },
      complete: res => {
        wx.hideLoading();
      }
    });
  },
  onNicknameInput: function(e) {
    this.setData({nickname: e.detail.value})
  },
  validateNickname: function() {
    if (this.data.nickname.trim() === '') {
      this.setData({isNicknameError: true})
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        complete: () => {this.setData({inputFocus: true})}
      });
      return false
    }
    return true
  },
  onEnter: function() {
    if (this.validateNickname()) {
      this.setData({isNicknameError: false})
      wx.showLoading({title: '正在登录……', mask: true})
      this.updateNickname(this.data.nickname)
        .then(res => {
          app.nickname = res.data.nickname;
          wx.hideLoading()
          this.gotoNextPage()
        })
        .catch(error => {
          console.error('welcome.onEnter() failed:', error)
          wx.hideLoading()
          wx.showToast({title: '登录失败', icon: 'none'})
        })
    }
  },
  updateNickname: function(nickname) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/update_nickname',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {token: app.token, nickname: nickname},
        success: resolve,
        fail: reject
      })    
    })
  },
  gotoNextPage: function() {
    wx.switchTab({url: '/pages/checkin/checkin'})
  }
})