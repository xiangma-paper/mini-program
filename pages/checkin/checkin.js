const app = getApp()

Page({
  data: {
    paperId: '',
    papers: []
  },
  onLoad: function() {
  },
  onPaperIdChanged: function(e) {
    this.data.paperId = e.detail.value
  },
  onSearch: function() {
    console.log('paperId:', this.data.paperId)
  }
})
