const app = getApp()

Page({
  data: {
    paperId: '',
    papers: []
  },
  onLoad: function() {
    console.log('checkin.onLoad()')
  },
  onPaperIdChanged: function(e) {
    this.data.paperId = e.detail.value
  },
  onSearch: function() {
    console.log('paperId:', this.data.paperId)
  }
})
