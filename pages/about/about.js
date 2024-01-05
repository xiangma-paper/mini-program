const app = getApp()

Page({
  data: {
    version: ''
  },
  onLoad: function() {
    console.log('about.onLoad()')
    this.setData({version: app.version})
  }
})