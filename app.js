const baseUrl = {
  develop: 'https://paper-hub.cn:8443', // 开发环境
  trial: 'https://paper-hub.cn:8443',   // 体验环境
  release: 'https://paper-hub.cn',      // 正式环境
}

App({
  version: '0.1.5',
  host: '',
  token: '',
  csrfToken: '',
  nickname: '',
  onLaunch: function() {
    const accountInfo = wx.getAccountInfoSync();
    this.host = baseUrl[accountInfo.miniProgram.envVersion];
  }
})