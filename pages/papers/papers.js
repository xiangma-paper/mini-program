const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    tables: []
  },
  onLoad: function() {
    console.log('papers.onLoad()')
    api.fetchPaperList((error, res) => {
      if (error) {
        wx.showToast({title: '载入文献列表失败', icon: 'none'})
        console.error('Fetch paper list failed:', error)
      } else {
        this.setData({tables: res.data.results})
      }
    })
  }
})
