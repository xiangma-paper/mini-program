const app = getApp();

function wxLogin(callback) {
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: app.host + '/api/wx_login',
          method: 'POST',
          data: {code: res.code},
          success: res => callback(null, res),
          fail: error => callback(error)
        })
      } else {
        callback(new Error('登录失败！' + res.errMsg))
      }
    }
  });
}

module.exports = {
  wxLogin
}
