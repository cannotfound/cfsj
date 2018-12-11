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
    form: {
      org_name: '广州好喝饮料有限公司',
      org_code: '5465892319898484',
      jbr_name: '经先生',
      jbr_ID: '440124198801015222',
      jbr_mail: '34587@qq.com',
      jbr_phone: '15018735310',
      wxopenid: '123',

    }

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady() {

    this.initValidate();

  },
  onLoad() {
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


            //console.log("authcode success.." + app.globalData.secret );
            console.log(res);
            var openid = res.data;
            that.data.form.wxopenid = openid;

            //console.log($('status').val() + '=234');
            //console.log(wx.createSelectorQuery().select());

          },
          fail: function (ex) {
            console.log(ex.errMsg + ":authcode");
          }
        })

      }

    })
  },

  initValidate() {
    const rules = {
      org_name: {
        required: true,
        minlength: 2,
      },
      org_code: {
        required: true,
      },
      jbr_name: {
        required: true,
      },
      jbr_ID: { required: true, idcard: true, },
      jbr_phone: { required: true, tel: true, },
      jbr_mail: { required: true, email: true, },

    }
    const messages = {
      org_name: {
        required: '请填写企业名称',
      },
      org_code: {
        required: '请填写信用代码',
      },
      jbr_name: {
        required: '请填写姓名',
      },
      jbr_ID: {
        required: '请填写身份证',
      },
      jbr_mail: {
        required: '请填写邮箱',
      },
      jbr_phone: {
        required: '请填写手机号码',
        tel: '请填写正确的手机号'
      },

    }
    this.WxValidate = new WxValidate(rules, messages);
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


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    const params = e.detail.value;
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    } else {

      var formValues = JSON.stringify({
        org_name: e.detail.value.org_name, unit_code: e.detail.value.org_code,
        jbr_name: e.detail.value.jbr_name, jbr_phone: e.detail.value.jbr_phone,
        jbr_ID: e.detail.value.jbr_ID, jbr_mail: e.detail.value.jbr_mail,
        _csrf_token: '76be886ef32f9151fd9bbfbce9d53e0b',
        jbr_weixin: this.data.form.wxopenid,
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
              wx.redirectTo({
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
