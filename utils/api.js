const app = getApp()

function fetchRankList(callback) {
  wx.request({
    url: app.host + '/api/fetch_rank_list',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'X-CSRFToken': app.csrfToken,
      'Cookie': 'csrftoken=' + app.csrfToken
    },
    data: {token: app.token},
    success: res => callback(undefined, res),
    fail: error => callback(error)
  })
}

function fetchRankFullList(self, index, callback) {
  console.log('fetchRankFullList')
  console.log('self:', self)
  console.log('index:', index)
  wx.request({
    url: app.host + '/api/fetch_rank_full_list',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'X-CSRFToken': app.csrfToken,
      'Cookie': 'csrftoken=' + app.csrfToken
    },
    data: {token: app.token, index: index},
    success: res => callback(self, index, undefined, res),
    fail: error => callback(self, index, error)
  })
}

module.exports = {
  fetchRankList,
  fetchRankFullList,
}
