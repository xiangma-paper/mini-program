const app = getApp()

function fetchPaperList(callback) {
  wx.request({
    url: app.host + '/api/fetch_paper_list',
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

function fetchPaperInfo(paperId, callback) {
  wx.request({
    url: app.host + '/api/fetch_paper_info',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'X-CSRFToken': app.csrfToken,
      'Cookie': 'csrftoken=' + app.csrfToken
    },
    data: {token: app.token, paper_id: paperId},
    success: res => callback(undefined, res),
    fail: error => callback(error)
  })
}

function submitComment(paperId, title, journal, pubYear, nickname, comment, callback) {
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
      paper_id: paperId,
      title: title,
      journal: journal,
      pub_year: pubYear,
      nickname: nickname,
      comment: comment
    },
    success: res => callback(undefined, res),
    fail: error => callback(error)
  })
}

module.exports = {
  fetchPaperList,
  fetchRankList,
  fetchRankFullList,
  fetchPaperInfo,
  submitComment,
}
