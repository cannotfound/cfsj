//index.js
//获取应用实例

import WxValidate from '../../utils/WxValidate.js';
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    form1: {
      org_name: '广州好喝饮料有限公司',
      org_code: '5465892319898484',
      jbr_name: '经先生',
      jbr_ID: '440124198801015222',
      jbr_mail: '34587@qq.com',
      jbr_phone: '15018735310',
      legal_person: '李大鹏1',
      legal_phone: '15018735310',
      wxopenid: '123',

    },
    showInfo: false,
    showSaveBtn: false,
    hiddenEditBtn: false,

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady() {

    util.initValidate(this);

  },
  onLoad(options) {

    this.setData({
      showInfo: options.method == 'view' ? true : false,
    });
    if(options.method == 'view'){
      this.setData({
        form: wx.getStorageSync('juser'),
      });
    }


    this.getUser();


    var that = this;
    wx.login({

      success: function (res) {
        console.log(res);

        wx.request({
          url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/authcodeAjax',
          method: "POST",
          header: { 'Content-type': 'application/x-www-form-urlencoded' },
          data: { code: res.code, sec: app.globalData.secret },
          success: function (res) {
            console.log('-----------')
            console.log(res);
            var openid = res.data;
            that.data.form1.wxopenid = openid;

          },
          fail: function (ex) {
            console.log(ex.errMsg + ":authcode");
          }
        })

      }

    })
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


  getUserInfo: function (e) {
    console.log(e)

    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  editUser: function(e){

    console.log('form发生了editUser事件，携带数据为：', e);
    var usubmit = wx.getStorageSync('u_submit');
    if(usubmit){
      wx.showModal({
        title: '警告',
        content: '新办申请单尚未完成，不允许修改资料！',
        showCancel: false,
      })
    }else{
      this.setData({
        showSaveBtn: true,
        hiddenEditBtn: true,
      });

    }

  },

  deleteUser: function(e){


    wx.showModal({
      title: '警告',
      content: '确定注销？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/deleteUserAjax',
            method: "POST",
            data: {
              openid: wx.getStorageSync('openid'),
              sec: app.globalData.secret
            },
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res);
              wx.clearStorageSync();
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                complete: function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              });
             

            },
            fail: function (ex) {
              console.log(ex.errMsg + " : delete user ajax");
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const params = e.detail.value;
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      util.showModal(error);
      return false;
    } else {

      var formValues = JSON.stringify({
        org_name: e.detail.value.org_name, 
        legal_person: e.detail.value.legal_person, legal_phone: e.detail.value.legal_phone,
        jbr_name: e.detail.value.jbr_name, jbr_phone: e.detail.value.jbr_phone,
        //jbr_ID: e.detail.value.jbr_ID, 经办人身份证
        jbr_mail: e.detail.value.jbr_mail,
        _csrf_token: '76be886ef32f9151fd9bbfbce9d53e0b',
        jbr_weixin: this.data.form.wxopenid,
        method: this.data.showInfo == true ? 'edit' : 'new',
      });

      wx.request({
        url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/registerAjax',
        method: "POST",
        data: {
          registerForm: formValues,
          sec: app.globalData.secret
        },
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res2) {
          console.log(res2);
          var showicon = res2.data.status == 'OK' ? 'success' : 'none';

          wx.showModal({
            title: '提示',
            content: res2.data.msg,
            showCancel: false,
            complete: function(){
 
              wx.reLaunch({
                url: '../index/index',
              })
            }
          })

        },
        fail: function (ex) {
          console.log(ex.errMsg + " :register");
        }
      })
    }
  },

  formReset: function () {
    console.log('form发生了reset事件')
  }
})
