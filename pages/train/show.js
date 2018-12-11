// pages/train/show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxopenid: null,
    lid: null,
    lesson: {
      id: 1,
      title: '教你在家去眼袋小方法,10天去眼袋既简单有容易',
      detail: '教你在家去眼袋小方法,10天去眼袋既简单有容易教你在家去眼袋小方法,10天去眼袋既简单有容易教你在家去眼袋小方法,10天去眼袋既简单有容易',
      from_date: '2018-10-24',
      to_date: '2018-10-24',
      first_day_start_time: '05:11',
      contact: '李白',
      tel: '110',
      place: '广州自己找'
    },
    flist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var id = options.id;
    this.setData({
      lid: id
    });
    var that = this;
    
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/lesson/viewAjax',
      data: { id: id, sec: app.globalData.secret},
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function(res){

        //console.log(res)
        that.setData({
          lesson: res.data
        });
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var lid = this.data.lid;
    var that = this;
    console.log(lid)
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/lesson/selectAttListAjax',
      method:'POST',
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: { lid: lid, sec: app.globalData.secret},
      success:function(res){
        that.setData({
          flist: res.data
        });
      }
    })
  },
  downloadFile: function(event){
   
   console.log(event)
   console.log("TARGET:" + event.currentTarget.id)
   
    var furl = "https://wx.gzis.org.cn/" + event.currentTarget.id;
    wx.showLoading({
      title: '正在下载文件...',
      mask: true
    });

    wx.downloadFile({
      url: furl,
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          
          
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(res){
              console.log(res)
              
          wx.openDocument({
            filePath: res.savedFilePath,
            success: function (res) {
              console.log('打开文档成功')
              wx.showShareMenu({
                withShareTicket: true
              })
            },
            fail: function(res){
              console.log(res)
              wx.showToast({
                title: '打开文档失败',
                icon: 'none'
              })
            }
          })
            }
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '下载失败！',
          icon: 'none'
        })
      },
      complete:function(res){
        wx.hideLoading();
      }
    })

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