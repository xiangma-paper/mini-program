const app = getApp()

Page({
  data: {
    themeClass: '',
    paperId: '',
    title: '',
    journal: '',
    pubYear: '',
    nickname: '',
    comment: '',
  },
  onLoad: function() {
    console.log('checkin.onLoad()')
    if (app.isDarkMode) {
      this.setData({themeClass:'darkmode'})
    } else {
      this.setData({themeClass:''})
    }
    let nickname = wx.getStorageSync('nickname')
    this.setData({nickname: nickname})
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
  onNicknameInput: function(e) {
    this.setData({nickname: e.detail.value})
  },
  onCommentInput: function(e) {
    this.setData({comment: e.detail.value})
  },
  fetchPaperInfo: function(paperId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/fetch_paper_info',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {token: app.token, paper_id: paperId},
        success: resolve,
        fail: reject
      })
    })
  },
  onFetch: function() {
    console.log('checkin.onFetch():', this.data.paperId)
    wx.showLoading({title: '正在查询……', mask: true})
    this.fetchPaperInfo(this.data.paperId)
      .then(res => {
        console.debug('fetchPaperInfo() returns:', res)
        this.setData({
          title: res.data.results.title,
          journal: res.data.results.journal,
          pubYear: res.data.results.pub_year,
        })
        wx.hideLoading()
      })
      .catch(error => {
        console.error('checkin.onFetch() failed:', error)
        wx.hideLoading()
        wx.showToast({title: '查询失败', icon: 'none'})
      })
  },
  submitComment: function() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/submit_comment',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {
          token: app.token,
          group_name: 'xiangma',
          paper_id: this.data.paperId,
          title: this.data.title,
          journal: this.data.journal,
          pub_year: this.data.pubYear,
          nickname: this.data.nickname,
          comment: this.data.comment
        },
        success: resolve,
        fail: reject
      })
    })
  },
  onSubmit: function() {
    console.log('checkin.onSubmit():')
    wx.showLoading({title: '正在打卡……', mask: true})
    this.submitComment()
      .then(res => {
        console.debug('submitComment() returns:', res)
        this.afterSubmit()
      })
      .catch(error => {
        console.error('submitComment() failed:', error)
        wx.hideLoading()
        wx.showToast({title: '打卡失败', icon: 'none'})
      })
  },
  afterSubmit: function() {
    wx.hideLoading()
    wx.showModal({
      title: '打卡成功',
      content: this.data.title + '\n' + this.data.comment,
      showCancel: false,
      complete: (res) => {
        this.submitOK()
      }
    })
  },
  submitOK: function() {
    if (this.data.nickname != app.nickname) {
      app.nickname = this.data.nickname
    }
    this.setData({
      paperId: '',
      title: '',
      journal: '',
      pubYear: '',
      comment: ''
    })
  }
})