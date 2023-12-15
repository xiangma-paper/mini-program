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
  })
}

function updateNickname(csrfToken, token, nickname, callback) {
  console.log('csrfToken:', csrfToken)
  console.log('token', token)
  console.log('nickname:', nickname)
  wx.request({
    url: app.host + '/api/update_nickname',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'X-CSRFToken': csrfToken,  // Set CSRF token in the header
      'Cookie': 'csrftoken=' + csrfToken  // Include CSRF token in the cookies
    },
    data: {token: token, nickname: nickname},
    success: res => callback(null, res),
    fail: error => callback(error)
  })
}

module.exports = {
  wxLogin,
  updateNickname
}
