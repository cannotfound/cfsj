//index.js
//获取应用实例

import WxValidate from '../../utils/WxValidate.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    register_org_name: '暂未绑定法人',
    wxopenid: null,
    imgUrls:[
      {id: 1, url: 'https://wx.gzis.org.cn/topimg1.jpg',},
      { id: 2, url: 'https://wx.gzis.org.cn/topimg2.jpg',},
      { id: 3, url: 'https://wx.gzis.org.cn/topimg3.jpg'}
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady(){
    
    wx.showShareMenu({
      withShareTicket: true
    })


  },

  onLoad(){

    wx.showLoading({
      title: '正在加载',
      mask: true
    });



    this.getUser();

    this.wxlogin();

    
  },

wxlogin(){
  var that = this;
  wx.login({

    success: function (res) {
      //console.log(res);

      wx.request({
        url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/authcodeAjax',
        method: "POST",
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
        data: { code: res.code, sec: app.globalData.secret, },
        success: function (res) {

          if(res.data == 'error') return;
          console.log("authcode success..");
          //console.log(res);
          var openid = res.data;
          that.setData({
            wxopenid: openid
          });
          wx.setStorageSync('openid', openid);
          that.getRegisterInfo();

        },
        fail: function (ex) {
          console.log(ex.errMsg + ":authcode");
        }
      })

    }

  })
},

  getRegisterInfo(){
    var that = this;
    var wxopenid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/GetUserAjax',
      method: 'POST',
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: { openid: wxopenid, sec: app.globalData.secret },
      success: function(res){
      console.log(res)
        
       if(!res.data.org_name){
         console.log('空空空');
       }else{
         
         wx.setStorageSync('juser', res.data);
         that.setData({
           register_org_name : res.data.org_name,
         });

        
       }
      },
      complete: function(res){
        wx.hideLoading();
      }
    })

  },

  getUser () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },


  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
