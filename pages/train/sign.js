// pages/train/sign.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lessonid: null,
    lessonname: null,
    jbr_name: null,
    jbr_phone: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //options.lid = 1;
    //options.title = '1fdrtnjrtnhjrth';

    var juser = wx.getStorageSync('juser');

    this.setData({
      lessonid: options.lid,
      lessonname: options.title,
      jbr_name: juser.jbr_name,
      jbr_phone: juser.jbr_phone,
    });
  },


  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var juser = wx.getStorageSync('juser');
    var uid = juser.id;
    var lessonid = this.lessonid;
    
    var fdata = JSON.stringify({
      full_name: e.detail.value.full_name, 
      phone: e.detail.value.phone,
      userid: uid,
      lessonid: e.detail.value.lessonid

    });


    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/lesson/applyAjax',
      data: { signForm: fdata, sec: app.globalData.secret },
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        //console.log(res)
        var tip = '未知原因';
        if(res.data == 'OK'){
          tip = '报名成功！';
        } else if (res.data == 'overlay'){
          tip = '您已经报名此课程, 不用重复报名！';
        }
        wx.showModal({
          title: '提示',
          content: tip,
          showCancel: false,
          success(res) {
            wx.redirectTo({
              url: 'index',
            })
          }
        })
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
  onShareAppMessage: function () {

  }
})