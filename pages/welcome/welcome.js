const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    isLoading: true,
    nickname: '',
    isNicknameError: false,
    inputFocus: false,
  },
  onLoad: function() {
    console.log('welcome.onLoad()')
    wx.showLoading({title: '正在启动……', mask: true})
    this.myInit()
      .then(res => {
        console.debug('myInit() returns:', res)
        this.setDebugMode(res.data.debug)
        return this.wxLogin()
      })
      .then(res => {
        console.debug('wxLogin() returns:', res)
        if (!res.code) {
          return Promise.reject(res.errMsg)
        }
        return this.myLogin(res.code)
      })
      .then(res => {
        console.debug('myLogin() returns:', res)
        if (!res.data.debug) {
          this.afterLogin(res)
        } else {
          this.setDebugMode(true)
          // since server changed for debug mode, we need to call login (on dev server) again
          console.debug('call myLogin again')
          this.wxLogin()
            .then(res => {
              console.debug('wxLogin() returns:', res)
              if (!res.code) {
                return Promise.reject(res.errMsg)
              }
              return this.myLogin(res.code)
            })
            .then(res => {
              console.debug('myLogin() returns:', res)
              this.afterLogin(res)
            })
        }
      })
      .catch(error => {
        console.error('welcome.onLoad() failed:', error)
        wx.hideLoading()
        wx.showToast({title: '启动失败', icon: 'none'})
      })
    console.log('welcome.onLoad() exiting')
  },
  wxLogin: function() {
    return new Promise((resolve, reject) => {
      wx.login({success: resolve, fail: reject})
    })
  },
  wxRequest: function(url) {
    return new Promise((resolve, reject) => {
      wx.request({url: url, success: resolve, fail: reject})
    })
  },
  myInit: function() {
    return this.wxRequest(app.host + '/api/wx')
  },
  myLogin: function(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/wx_login',
        method: 'POST',
        data: {code: code},
        success: resolve,
        fail: reject
      })
    })
  },
  setDebugMode: function(debug) {
    if (debug) {
      console.log('switch to DEBUG mode')
      app.host = app.host_debug
    }
    console.log('host:', app.host)
  },
  afterLogin: function(res) {
    if (!res.data.success) {
      return Promise.reject(res.errMsg)
    }
    app.token = res.data.token
    app.csrfToken = res.data.csrfToken
    app.nickname = res.data.nickname
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('csrfToken', res.data.csrfToken)
    wx.setStorageSync('nickname', res.data.nickname)
    if (res.data.nickname != '') {
      this.gotoNextPage()
    } else {
      this.setData({
        isLoading: false,
        nickname: res.data.nickname
      })
      wx.hideLoading()
    }
  },
  onNicknameInput: function(e) {
    this.setData({nickname: e.detail.value})
  },
  validateNickname: function() {
    if (this.data.nickname.trim() === '') {
      this.setData({isNicknameError: true})
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        complete: () => {this.setData({inputFocus: true})}
      });
      return false
    }
    return true
  },
  onEnter: function() {
    if (this.validateNickname()) {
      this.setData({isNicknameError: false})
      wx.showLoading({title: '正在登录……', mask: true})
      this.updateNickname(this.data.nickname)
        .then(res => {
          wx.setStorageSync('nickname', res.data.nickname)
          wx.hideLoading()
          this.gotoNextPage()
        })
        .catch(error => {
          console.error('welcome.onEnter() failed:', error)
          wx.hideLoading()
          wx.showToast({title: '登录失败', icon: 'none'})
        })
    }
  },
  updateNickname: function(nickname) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/update_nickname',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {token: app.token, nickname: nickname},
        success: resolve,
        fail: reject
      })    
    })
  },
  gotoNextPage: function() {
    wx.switchTab({url: '/pages/checkin/checkin'})
  }
})