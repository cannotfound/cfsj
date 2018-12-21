// pages/apply/index.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 0,
    swiperHeight: 100,
    haveRegistered: false,
    form: {
      org_name: '广州好喝饮料有限公司',
      org_code: '5465892319898484',
      jbr_name: '经先生',
      jbr_ID: '440124198801015222',
      jbr_mail: '34587@qq.com',
      jbr_phone: '15018735310',
      legal_person: '李大鹏1',
      legal_phone: '15018735310',

    },
    u_license: false,
    u_ticket: false,
    license_accept_status: '-',
    ticket_accept_status: '-',
 


  },

  copyToClipTap: function(res){
    wx.setClipboardData({
      data: 'https://wx.gzis.org.cn/dszr/web/20181204.doc',
      success: function(res){
        console.log('复制到剪粘板成功！')
        wx.showModal({
          title: '提示',
          content: '表格下载链接复制成功，退出小程序去下载吧！',
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var juser = wx.getStorageSync('juser');
    //console.log(util.isBlank(juser))
    if (!util.isBlank(juser)) {
      this.setData({

        form: juser
      })
    }

    var step = options.step;
    if (options.step == null) step = 0;

    this.setData({
      currentStep: step,
    })

    if (step == 0) {
      util.initValidate(this);
    }
    if (step == 1) {}
    if (step == 2) {}

    var juser = wx.getStorageSync('juser');
    if (juser.id == null) {
      console.log("meiyou zhuce")
    } else {
      this.setData({
        haveRegistered: true
      });
    }

  },

  navStep: function(e, step) {
    //console.log(e + "====" + step)
 
    if (e != null) {
      if (e.detail.source == 'touch') {
        this.setData({
          currentStep: e.detail.current
        });
        this.stepOnload(e.detail.current);
      } else if (e.detail.source == null) {
        this.setData({
          currentStep: e.target.dataset.current - 1,
        });
        this.stepOnload(e.target.dataset.current - 1);
      }
    }
    if (step != null) {
      this.setData({
        currentStep: step - 1,
      })
      this.stepOnload(step - 1);
    }

    
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  stepOnload: function (gostep){
    var that = this;
    if (gostep == 0) {
      console.log("1 step")
    }
    if (gostep == 1) {
      console.log("2 step")
      that.setData({
        u_license: false,
        u_ticket: false,
      });
      wx.request({
        url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/getUploadInfoAjax',
        method: 'POST',
        data: {
          'sec': app.globalData.secret,
          'openid': wx.getStorageSync('openid'),
        },
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
        success: function(res){
          console.log(res)

          if( !util.isBlank(res.data)){

            that.setData({
              u_license: res.data.license,
              u_ticket: res.data.ticket,
            });
          }


        }
      })


    }
    if (gostep == 2) {
      console.log("3 step")
      wx.request({
        url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/getAcceptStatusAjax',
        method: 'POST',
        data: {
          'sec': app.globalData.secret,
          'openid': wx.getStorageSync('openid'),
        },
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
        success: function(res){
          console.log(res.data.license_status)
          that.setData({
            license_accept_status: res.data.license_status,
            ticket_accept_status: res.data.ticket_status,

          });

        },
        
      })
    }
  },
  goStep: function(e) {
    //console.log(e)
    this.navStep(null, e.target.id);

  },
  showAccountBtn: function(e){
    wx.navigateTo({
      url: 'showAccount'
    })
  },
  uploadBtn: function(e) {

    var that = this;
    var filetype = e.currentTarget.id;
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original', 'compressed'],
      success: function(res) {

        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/uploadAjax', //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data;charset=utf-8",
            'accept': 'application/json',
            'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
          },
          formData: {
            'user': 'test-user', //其他额外的formdata，可不写
            'sec': app.globalData.secret,
            'openid': wx.getStorageSync('openid'),
            'file_type': filetype,
          },
          method: 'POST',
          success: function(res) {
            var data = JSON.parse(res.data);
            console.log(data);
            if (data.status=='success'){
            that.stepOnload(1);}
          },
          fail: function(res) {
            console.log('fail:' + JSON.stringify(res));

          },

        });

      }
    })
  },

  resetFileBtn: function(e){
    var that = this;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/uploadResetAjax',
      method: 'POST',
      data: {
        'sec': app.globalData.secret,
        'openid': wx.getStorageSync('openid'),
      },
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      success: function(res){
        console.log(res)
        if(res.data == 'OK'){
          that.stepOnload(1);
        }     
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var query = wx.createSelectorQuery();
    var that = this;
    var bottomB, topviewT;

    query.select('#bottomView').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      //console.log("query=" + JSON.stringify( res));
      bottomB = res[0].bottom;

      var query2 = wx.createSelectorQuery();
      query2.select('#topView').boundingClientRect();
      query2.selectViewport().scrollOffset();
      query2.exec(function(res2) {
        //console.log("query=" + JSON.stringify(res2));
        topviewT = res2[0].top;

        var swiperH = bottomB - topviewT + 20;
        //console.log(swiperH + "px");

        that.setData({
          swiperHeight: swiperH,
        });
      });

    });




  },

  formSubmit: function(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const params = e.detail.value;
    var that = this;
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      util.showModal(error);
      return false;
    } else {

      var formValues = JSON.stringify({
        org_name: e.detail.value.org_name,
        legal_person: e.detail.value.legal_person,
        legal_phone: e.detail.value.legal_phone,
        jbr_name: e.detail.value.jbr_name,
        jbr_phone: e.detail.value.jbr_phone,
        jbr_ID: e.detail.value.jbr_ID,
        jbr_mail: e.detail.value.jbr_mail,
        _csrf_token: '76be886ef32f9151fd9bbfbce9d53e0b',
        jbr_weixin: wx.getStorageSync('openid'),
        method: 'new',
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
        success: function(res2) {
          console.log(res2);
          var showicon = res2.data.status == 'OK' ? 'success' : 'none';
          util.getRegisterInfo(that);
          wx.showModal({
            title: '提示',
            content: res2.data.msg,
            showCancel: false,
            complete: function() {
              wx.redirectTo({
                url: 'index?step=1',
              })
            }
          })

        },
        fail: function(ex) {
          console.log(ex.errMsg + " :register");
        }
      })
    }
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