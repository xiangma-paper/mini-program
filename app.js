function makeRequest(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      success: resolve,
      fail: reject
    })
  })
}

App({
  host: 'https://paper-hub.cn',
  host_debug: 'https://paper-hub.cn:8443',
  token: '',
  csrfToken: '',
  nickname: '',
  onLaunch: function() {
    console.log('app.onLaunch()')
    wx.showLoading({title: '正在启动……', mask: true})
    const self = this
    makeRequest(this.host + '/api/wx').then(res => {
      if (res.data.debug) {
        console.log('switch to DEBUG mode')
        self.host = self.host_debug
      }
    }).finally(() => {
      console.log('host:', self.host)
    })
  }
})
