const baseUrl = {
  develop: 'https://paper-hub.cn:8443', // 开发环境
  trial: 'https://paper-hub.cn:8443',   // 体验环境
  release: 'https://paper-hub.cn',      // 正式环境
};

App({
  version: '0.1.5',
  onLaunch: function() {
    // 根据小程序发布版本，确定使用对应后端环境
    const accountInfo = wx.getAccountInfoSync();
    this.host = baseUrl[accountInfo.miniProgram.envVersion];
  },
})