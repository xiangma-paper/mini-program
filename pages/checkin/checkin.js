const app = getApp()

Page({
  data: {
    paperId: '',
    isPaperIdError: false,
    title: '',
    isTitleError: false,
    journal: '',
    isJournalError: false,
    pubYear: '',
    isPubYearError: false,
    nickname: '',
    isNicknameError: false,
    comment: '',
    isCommentError: false,
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
  checkPaperId: function() {
    const paperId = this.data.paperId || ''
    if (paperId.trim() === '') {
      this.setData({isPaperIdError: true})
      wx.showToast({
        title: '文献ID不能为空',
        icon: 'none',
        complete: () => {this.setData({paperIdFocus: true})}
      });
      return false
    }
    this.setData({isPaperIdError: false})
    return true
  },
  checkTitle: function() {
    const title = this.data.title || ''
    if (title.trim() === '') {
      this.setData({isTitleError: true})
      wx.showToast({
        title: '文献标题不能为空',
        icon: 'none',
        complete: () => {this.setData({titleFocus: true})}
      });
      return false
    }
    this.setData({isTitleError: false})
    return true
  },
  checkJournal: function() {
    const journal = this.data.journal || ''
    if (journal.trim() === '') {
      this.setData({isJournalError: true})
      wx.showToast({
        title: '杂志名称不能为空',
        icon: 'none',
        complete: () => {this.setData({journalFocus: true})}
      });
      return false
    }
    this.setData({isJournalError: false})
    return true
  },
  checkPubYear: function() {
    const pubYear = this.data.pubYear || ''
    if (pubYear.trim() === '') {
      this.setData({isPubYearError: true})
      wx.showToast({
        title: '发表年份不能为空',
        icon: 'none',
        complete: () => {this.setData({pubYearFocus: true})}
      });
      return false
    }
    this.setData({isPubYearError: false})
    return true
  },
  checkNickname: function() {
    const nickname = this.data.nickname || ''
    if (nickname.trim() === '') {
      this.setData({isNicknameError: true})
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        complete: () => {this.setData({nicknameFocus: true})}
      });
      return false
    }
    this.setData({isNicknameError: false})
    return true
  },
  checkComment: function() {
    const comment = this.data.comment || ''
    if (comment.trim() === '') {
      this.setData({isCommentError: true})
      wx.showToast({
        title: '简评内容不能为空',
        icon: 'none',
        complete: () => {this.setData({commentFocus: true})}
      });
      return false
    }
    if (this.data.comment.trim().length() < 50) {
      this.setData({isCommentError: true})
      wx.showToast({
        title: '简评内容太短',
        icon: 'none',
        complete: () => {this.setData({commentFocus: true})}
      });
      return false
    }
    this.setData({isCommentError: false})
    return true
  },
  onFetch: function() {
    console.log('checkin.onFetch():', this.data.paperId)
    if (!this.checkPaperId()) return
    wx.showLoading({title: '正在查询……', mask: true})
    this.fetchPaperInfo(this.data.paperId)
      .then(res => {
        console.debug('fetchPaperInfo() returns:', res)
        this.setData({
          title: String(res.data.results.title || '').trim(),
          journal: String(res.data.results.journal || '').trim(),
          pubYear: String(res.data.results.pub_year || '').trim(),
        })
        wx.hideLoading()
      })
      .catch(error => {
        console.error('checkin.onFetch() failed:', error)
        wx.hideLoading()
        wx.showToast({title: '查询失败', icon: 'none'})
      })
  },
  onSummarizeByGPT: function() {
    console.log('checkin.onSummarizeByGPT():')
    if (!this.checkPaperId()) return
    if (!this.checkTitle()) return
    if (!this.checkJournal()) return
    if (!this.checkPubYear()) return
    wx.showLoading({title: '正在查询……', mask: true})
    this.summarizeByGPT()
      .then(res => {
        console.debug('summarizeByGPT() returns:', res)
        this.setData({comment: res.data.answer})
        wx.hideLoading()
      })
      .catch(error => {
        console.error('summarizeByGPT() failed:', error)
        wx.hideLoading()
        wx.showModal({title: '查询失败', icon: 'none'})
      })
  },
  onSubmit: function() {
    console.log('checkin.onSubmit():')
    if (!this.checkTitle()) return
    if (!this.checkJournal()) return
    if (!this.checkPubYear()) return
    if (!this.checkNickname()) return
    if (!this.checkComment()) return
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
  summarizeByGPT: function() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/summarize_by_gpt',
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
        },
        success: resolve,
        fail: reject
      })
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