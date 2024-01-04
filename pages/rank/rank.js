const app = getApp()

Page({
  data: {
    currentTab: 0,
    tabs: ["本月榜单", "上月榜单", "总榜单", "杂志榜单"],
    tables: []
  },
  onLoad: function () {
    console.log('rank.onLoad()')
    this.refreshPage()
  },
  onShow: function() {
    console.log('rank.onShow()')
    this.refreshPage()
  },
  onPullDownRefresh: function() {
    console.log('rank.onPullDownRefresh()')
    this.refreshPage()
    wx.stopPullDownRefresh();
  },
  refreshPage: function() {
    wx.showLoading({title: '正在查询榜单……', mask: true})
    this.fetchRankList()
      .then(res => {
        console.log(res)
        this.setData({tables: res.data.results})
        wx.hideLoading()
      })
      .catch(error => {
        wx.showToast({title: '查询榜单失败', icon: 'none'})
        console.error('Fetch rank list failed:', error)
      })
  },
  onShowFullRank: function(e) {
    wx.showLoading({title: '正在查询……', mask: true})
    const index = this.data.currentTab
    this.fetchRankFullList(index)
      .then(res => {
        let newTables = this.data.tables
        newTables[index] = res.data.results
        this.setData({tables: newTables})
        wx.hideLoading()
      })
      .catch(error => {
        wx.showToast({title: '查询榜单失败', icon: 'none'})
        console.error('Fetch rank list failed:', error)
      })
  },
  fetchRankList: function() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/fetch_rank_list',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {
          token: app.token,
          group_name: 'xiangma'
        },
        success: resolve,
        fail: reject
      })
    })
  },
  fetchRankFullList: function(index) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.host + '/api/fetch_rank_full_list',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-CSRFToken': app.csrfToken,
          'Cookie': 'csrftoken=' + app.csrfToken
        },
        data: {
          token: app.token,
          group_name: 'xiangma',
          index: index
        },
        success: resolve,
        fail: reject
      })
    })
  },
  switchTab: function (event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentTab: index })
  },
})
