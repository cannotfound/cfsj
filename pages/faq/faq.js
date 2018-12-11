// pages/faq/faq.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({
      title: '正在加载',
      mask: true
    });

    var that = this;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/faq/listAjax',
      method: 'POST',
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: { sec: app.globalData.secret},
      success: function (res) {
        var list = res.data.list;
        console.log(list)
        that.setData({
          list: list,
        })
      },
      complete: function(res){
        wx.hideLoading();
      }
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
  onShareAppMessage: function (res) {
    console.log(res.from + ' share from')

    return {
      title: '转发业务问答',
    }
  }
})