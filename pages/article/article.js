// pages/article/article.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showLoading({
      title: '正在加载',
      mask: true
    });


    var openid = wx.getStorageSync('openid');
    //console.log(openid + "=openid" + "; options.hr=" + options.hr);





    var that = this;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/article/listAjax',
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sec: app.globalData.secret
      },
      success: function(res) {
        var list = res.data.list;
        console.log(list)
        that.setData({
          list: list,
        })
        for (var i = 0, len = list.length; i < len; i++) {
          //console.log(list[i].content);


        }

      },
      complete: function(res2) {
        wx.hideLoading();
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll: function(e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    e.scroll
  }
})