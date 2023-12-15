const api = require('../../utils/api.js');

Page({
  data: {
    isLoading: true,
    nickname: '',
    isNicknameError: false,
    inputFocus: false,
    token: '',
    csrfToken: '',
  },
  onLoad: function() {
    wx.showLoading({title: '正在载入……', mask: true})
    api.wxLogin((error, res) => {
      if (error) {
        wx.showToast({title: '登录失败', icon: 'none'});
        console.error('Login failed:', error);
      } else {
        console.log('Login success:', res);
        if (res.data.success) {
          this.setData({
            token: res.data.token,
            csrfToken: res.data.csrfToken
          })
          wx.setStorage({key: 'token', data: res.data.token})
          wx.setStorage({key: 'csrfToken', data: res.data.csrfToken})
          if (res.data.nickname != '') {
            this.gotoNextPage();
          }
        }
      }
      this.setData({isLoading: false});
      wx.hideLoading();
    });
  },
  onNicknameInput: function(e) {
    this.setData({nickname: e.detail.value})
  },
  validateNickname: function() {
    if (this.data.nickname.trim() === '') {
      this.setData({isNicknameError: true});
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        complete: () => {this.setData({inputFocus: true});}
      });
      return false;
    }
    return true;
  },
  onEnter: function() {
    if (this.validateNickname()) {
      this.setData({isNicknameError: false})
      wx.showLoading({title: '正在登录……', mask: true})
      api.updateNickname(this.data.csrfToken, this.data.token, this.data.nickname, (error, res) => {
        wx.hideLoading();
        if (error) {
        } else {
          this.gotoNextPage();
        }
      });
    }
  },
  gotoNextPage: function() {
    wx.switchTab({url: '/pages/checkin/checkin'});
  }
})