//index.js
//获取应用实例

import WxValidate from '../../utils/WxValidate.js';
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    register_org_name: '暂未绑定法人',
    haveRegistered: false,
    wxopenid: null,
    imgUrls: [{
        id: 1,
        url: 'https://wx.gzis.org.cn/topimg1.jpg',
      },
      {
        id: 2,
        url: 'https://wx.gzis.org.cn/topimg2.jpg',
      },
      {
        id: 3,
        url: 'https://wx.gzis.org.cn/topimg3.jpg'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady() {

    wx.showShareMenu({
      withShareTicket: true
    })


  },

  onLoad() {

    wx.showLoading({
      title: '正在加载',
      mask: true
    });


    //this.getUser();

    util.wxlogin(this);

  },

  onShow: function() {
    var juser = wx.getStorageSync('juser');
    if (!util.isBlank(juser)) {
      this.setData({
        form: juser,
        haveRegistered: true,
        register_org_name: juser.org_name
      })
    }

  },


  getUser() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      console.log('退出 -------------')
      var pages = getCurrentPages();
      wx.navigateBack({
        delta: -1,
      })

    }
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  btXinban() {
    wx.navigateTo({
      url: '../apply/index',
    })
  },
  btTongzhi() {
    wx.navigateTo({
      url: '../article/article',
    })
  },
  btZhinan() {
    wx.navigateTo({
      url: '../guide/index',
    })
  },
  btPeixun() {
    wx.navigateTo({
      url: '../train/index',
    })
  },
  btFaq() {
    wx.navigateTo({
      url: '../faq/faq',
    })
  },

})