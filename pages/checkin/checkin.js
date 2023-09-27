const app = getApp()

Page({
  data: {
    loggedIn: false,
    theme: wx.getSystemInfoSync().theme,
    token: '',
    nickname: 'abc',
    nicknameError: false,
    paperId: '',
    paperIdError: false,
    paperInfo: '',
    paperTitle: '',
    paperAuthors: '',
    comment: '',
    commentError: false,
  },
  onLoad: function() {
    wx.onThemeChange(res => {
      this.setData({theme: res.theme})
    })
    const token = wx.getStorageSync('token')
    const nickname = wx.getStorageSync('nickname')
    this.setData({token:token, nickname:nickname})
  },
  onReady: function() {
  },
  login: function() {
    wx.login({
      success: res => {
        console.log('wx.login() return:', res)
        if (res.errno) {
          console.log(res.errMsg)
        } else {
          wx.request({
            url: app.host + '/api/wx_login',
            method: 'POST',
            data: {
              nickname: this.data.nickname,
              code: res.code,
            },
            success: res => {
              console.log('wx_login return:', res)
              if (res.data.success) {
                wx.setStorageSync('access_token', res.data.token)
                this.setData({
                  loggedIn: true,
                  token: res.data.token,
                })
              }
            }
          })
        }
      }
    })
  },
  queryPaperInfo: function() {
    console.log(`queryPaperInfo: ${this.data.nickname} ${this.data.paperId} ${this.data.paperInfo} ${this.data.comment}`)
    wx.request({
      url: app.host + '/api/query/paper/' + this.data.paperId,
      header: {'content-type': 'application/json'},
      success: res => {
        this.setData({
          paperInfo: res.data.results.pub_year + ', ' + res.data.results.journal,
          paperTitle: res.data.results.title,
          paperAuthors: res.data.results.authors.join(', ')
        })
      }
    })
  },
  submitPaperComment: function() {
    console.log(`submitPaperComment: ${this.data.nickname} ${this.data.paperId} ${this.data.paperInfo} ${this.data.comment}`)

    const accessToken = wx.getStorageSync('access_token');
    if (!accessToken) {
      console.log('User is not authenticated. Access token is missing.');
      return;
    }

    const nickname = this.data.nickname.trim()
    if (nickname === '') {
      this.setData({nicknameError: true})
      wx.showToast({title: '请填写昵称', icon: 'error'})
      wx.createSelectorQuery().select('#inputNickname').boundingClientRect(function(rect) {
        wx.pageScrollTo({scrollTop: rect.top})
      }).exec()
      return
    }
    this.setData({nicknameError: false})

    const paperId = this.data.paperId.trim()
    if (paperId === '') {
      this.setData({paperIdError: true})
      wx.showToast({title: '请填写文献ID', icon: 'error'})
      wx.createSelectorQuery().select('#inputPaperId').boundingClientRect(function(rect) {
        wx.pageScrollTo({scrollTop: rect.top})
      }).exec()
      return
    }
    this.setData({paperIdError: false})

    const comment = this.data.comment.trim()
    if (comment === '') {
      this.setData({commentError: true});
      wx.showToast({title: '请填写评价语', icon: 'none'})
      wx.createSelectorQuery().select('#inputComment').boundingClientRect(function(rect) {
        wx.pageScrollTo({scrollTop: rect.top})
      }).exec()
      return
    }
    this.setData({commentError: false})

/*
    wx.request({
      url: app.host + '/api/add/paper/' + this.data.paperId,
      header: {'content-type': 'application/json'},
      success: res => {
        this.setData({
          paperInfo: res.data.results.pub_year + ', ' + res.data.results.journal,
          paperTitle: res.data.results.title,
          paperAuthors: res.data.results.authors.join(', ')
        })
      }
    })
*/
  }
})
