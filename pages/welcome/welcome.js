const api = require('../../utils/api.js');

Page({
  data: {
    isLoading: true,
    nickname: '',
    isNicknameError: false,
    inputFocus: false
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
          this.setData({nickname: res.data.nickname});
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
      console.log("Nickname: ", this.data.nickname);
      // Proceed with further actions
    }
  }
})
