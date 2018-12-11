// pages/article/show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    content: null,
    edit_date: null,
    articleid: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      articleid: options.id
    });
    var that = this;
    var articleid = options.id;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/article/showAjax',
      method: 'POST',
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: { articleid: articleid, sec: app.globalData.secret },
      success: function (res){
        //console.log(res);
        that.setData({
          title: res.data.article[0].title,
          content: res.data.article[0].content,
          edit_date: res.data.article[0].edit_date,

        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})