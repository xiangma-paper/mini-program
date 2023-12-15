const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    paperId: '',
    title: '',
    journal: '',
    pubYear: '',
    comment: '',
  },
  onLoad: function() {
    console.log('checkin.onLoad()')
  },
  onPaperIdInput: function(e) {
    this.setData({paperId: e.detail.value})
  },
  onTitleInput: function(e) {
    this.setData({title: e.detail.value})
  },
  onJournalInput: function(e) {
    this.setData({journal: e.detail.value})
  },
  onPubYearInput: function(e) {
    this.setData({pubYear: e.detail.value})
  },
  onCommentInput: function(e) {
    this.setData({comment: e.detail.value})
  },
  onFetch: function() {
    console.log('onFetch:', this.data.paperId)
    wx.showLoading({title: '正在查询……', mask: true})
    api.fetchPaperInfo(this.data.paperId, (error, res) => {
      wx.hideLoading()
      if (error) {
        wx.showToast({title: '查询失败', icon: 'none'})
      } else {
        console.log('res:', res)
        this.setData({
          title: res.data.results.title,
          journal: res.data.results.journal,
          pubYear: res.data.results.pub_year,
        })
      }
    })
  },
  onCheckIn: function() {
    console.log('onCheckIn:')
    wx.showLoading({title: '正在查询……', mask: true})
    api.submitComment(
      this.data.paperId,
      this.data.title,
      this.data.journal,
      this.data.pubYear,
      this.data.comment,
      (error, res) => {
      wx.hideLoading()
      if (error) {
        wx.showToast({title: '打卡失败', icon: 'none'})
      } else {
        console.log('res:', res)
        wx.showToast({
          title: '提交成功', icon: 'none',
        })
        this.setData({
          paperId: '',
          title: '',
          journal: '',
          pubYear: '',
          comment: ''
        })
      }
    })
  }
})