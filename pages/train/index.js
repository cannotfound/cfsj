// pages/train/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {




    wx.showLoading({
      title: '正在加载',
      mask: true
    });

    var that = this;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/lesson/listAjax',
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sec: app.globalData.secret
      },
      success: function(res) {

        //console.log(res.data)
        that.setData({
          list: res.data
        });

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var juser = wx.getStorageSync('juser');
    var userId = juser.id;
    var that = this;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/lesson/selectApplyAjax',
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userid: userId,
        sec: app.globalData.secret
      },
      success: function(res) {
        console.log(res)
        that.setData({
          tlist: res.data
        });
      }
    })

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

  }
})