// pages/apply/index.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 1,
    swiperHeight: 100,
    haveRegistered: false,
    form1: {
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
    u_submit: false,
    license_accept_status: '-',
    ticket_accept_status: '-',
    chargeArray: {
      '单个企业': '2080',
      '集团企业': '3200',
      '进出口企业': '3200',

    }


  },

  copyToClipTap: function(res) {

    if (!this.data.u_submit) {
      wx.showModal({
        title: '提示',
        content: '请先在第二步提交上传资料',
        showCancel: false,
      })
      return;
    }

    wx.setClipboardData({
      data: 'https://wx.gzis.org.cn/dszr/web/zhuce_biao.doc',
      success: function(res) {
        console.log('复制到剪粘板成功！')
        wx.showModal({
          title: '提示',
          content: '表格下载链接复制成功，请打开电脑浏览器下载打印吧！',
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var juser = wx.getStorageSync('juser');

    if(util.isBlank(juser)){
      console.log('没有注册信息------APPLY');
      this.setData({
        u_license: false,
        u_ticket: false,
        u_submit: false,
      });
    }

    var step = options.step;
    var hasSubmit = wx.getStorageSync('u_submit');
    if (options.step == null) step = 1;
    if (hasSubmit) step = 3;//如果已经提交，打开新办直接到第三步

    this.setData({
      currentStep: step,
    })

    if (step == 1) {
      util.initValidate(this);
    }
    if (step == 2) {}
    if (step == 3) {}

  },

  navStep: function(e, step) {
    console.log(e)

    if (e != null) {
      //touch来的swiper-item ID从0开始
      if (e.detail.source == 'touch') {
        this.setData({
          currentStep: e.detail.current + 1
        });
        this.stepOnload(e.detail.current + 1);
      } else if (e.detail.source == null) {
        this.setData({
          currentStep: e.target.dataset.current,
        });
        this.stepOnload(e.target.dataset.current);
      }
    } else if (step != null) {
      this.setData({
        currentStep: step,
      })
      this.stepOnload(step);
    }

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  stepOnload: function(gostep) {

    var that = this;
    this.resizeSwiperItemHeight(this.data.currentStep);
    if (gostep == 1) {
      console.log("1 step")
      //this.resizeSwiperItemHeight(this.data.currentStep);
    }
    if (gostep == 2) {
      console.log("2 step")
      that.getUploadInfo();
    }
    if (gostep == 3) {
      console.log("3 step")
    }

  },
  goStep: function(e) {
    //console.log(e)
    this.navStep(null, e.target.id);

  },
  showAccountBtn: function(e) {
    wx.navigateTo({
      url: 'showAccount'
    })
  },
  uploadBtn: function(e) {

    if (!this.data.haveRegistered) {
      wx.showModal({
        title: '提示',
        content: '请先注册',
        showCancel: false,
      })
      return;
    }
    var that = this;
    var filetype = e.currentTarget.id;
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original'],
      success: function(res) {

        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        var filesize = res.tempFiles[0].size;
        filesize = filesize / 1024 / 1024;

        if (filesize >= app.globalData.upload_max_size) {
          wx.showModal({
            title: '警告',
            content: '上传文件最大不能超过' + app.globalData.upload_max_size + "M",
          })
          return;
        }
        const uploadTask = wx.uploadFile({
          url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/uploadAjax',
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data;charset=utf-8",
            'accept': 'application/json',
          },
          formData: {
            'user': 'test-user',
            'sec': app.globalData.secret,
            'openid': wx.getStorageSync('openid'),
            'file_type': filetype,
          },
          method: 'POST',
          success: function(res) {
            var data = JSON.parse(res.data);
            console.log(res);
            if (data.status == 'success') {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.stepOnload(2);
            } else {
              console.log('wx.uploadFile status 不是success!!!')
              wx.showModal({
                title: '警告',
                content: data.msg,
              })
            }
          },
          fail: function(res) {
            console.log('fail:' + JSON.stringify(res));
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            })
          },

        });

        wx.showLoading({
          title: '正在上传',
        });

        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)

          if (res.progress == 100) {
            wx.hideLoading();

          }

        })

      }
    })
  },

  deleteUser: function (e) {


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
              console.log(res)
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
              })

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

  getUploadInfo: function(e) {

    var that = this;
    that.setData({
      u_license: false,
      u_ticket: false,
    });
    wx.setStorageSync('u_submit', false);
    var juser = wx.getStorageSync('juser');
    if(juser == null) return;
    var userid = juser.id;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/getUploadInfoAjax',
      method: 'POST',
      data: {
        'sec': app.globalData.secret,
        'uid': userid,
      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)

        if (!util.isBlank(res.data)) {

          that.setData({
            u_license: res.data.license,
            u_ticket: res.data.ticket,
          });
          if (res.data.license == 2 && res.data.ticket == 2) {
            that.setData({
              u_submit: true
            });
            wx.setStorageSync('u_submit', true);
          }
        }
      },
      complete: function(res2) {
        that.resizeSwiperItemHeight(that.data.currentStep);
      }
    })
  },
  resetFileBtn: function(e) {
    var that = this;
    var juser = wx.getStorageSync('juser');
    if (juser == null) return;
    var userid = juser.id;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/resetUploadAjax',
      method: 'POST',
      data: {
        'sec': app.globalData.secret,
        'userid': userid,
      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        if (res.data == 'OK') {
          that.stepOnload(2);
        }
      }
    })


  },
  viewUploadImg: function(type){

    var juser = wx.getStorageSync('juser');
    var userid = juser.id;
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/GetDlUrlAjax',
      method: 'POST',
      data: {
        'sec': app.globalData.secret,
        'user_id': userid,
        'file_type': type,
      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 'ok') {
          //downloadwuAjaxAction
          var furl = res.data.url + '&uid=' + userid;
          wx.downloadFile({
            url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/' + furl,
            success(res) {

              console.log(res)
              if (res.statusCode === 200) {

                wx.previewImage({
                  urls: [res.tempFilePath],
                })

                // wx.saveFile({
                //   tempFilePath: res.tempFilePath,
                //   success: function (res) {
                //     console.log(res)
                //     wx.previewImage({
                //       urls: [res.savedFilePath],
                //     })
                //   }
                // })
              }
            },
            complete(res){
              wx.hideLoading();
            }
          });
        }
      }
    });
  },
  btViewLicense: function (e) {

    wx.showLoading({
      title: '正在预览...',
    });
    this.viewUploadImg(1);

   },
  btViewTicket: function (e) { 
    wx.showLoading({
      title: '正在预览...',
    });
    this.viewUploadImg(2);
  },
  btnCancel:function(){


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var juser = wx.getStorageSync('juser');
    if (!util.isBlank(juser)) {
      if (juser.id == null) {
        console.log("meiyou zhuce")
      } else {
        this.setData({
          haveRegistered: true,
          form: juser
        });
      }
    }

    var step = this.data.currentStep;
    this.navStep(null, step);

    this.getUploadInfo();


  },

  resizeSwiperItemHeight: function(step) {
    //swiper中的写定单位rem
    var that = this;
    var height = 30;
    if (step == 1) {
      height = 30;
      if(that.data.haveRegistered){
        height = 34;
      }
    }
    if(step == 2){
      height = 50;
    }
    if(step == 3){
      height = 40;
    }


    that.setData({
      swiperHeight: height,
    });
    return;



    var selectClassB = '.bottomView' + step;
    var selectClassT = '.topView' + step;

    var query = wx.createSelectorQuery();
    var bottomB, topviewT;

    query.select(selectClassB).boundingClientRect();
    query.selectViewport(); //.scrollOffset();
    query.exec(function(res) {
      //console.log(step + "query=" + JSON.stringify( res));
      bottomB = res[0].bottom;

      var query2 = wx.createSelectorQuery();
      query2.select(selectClassT).boundingClientRect();
      //query2.selectViewport();//.scrollOffset();
      query2.exec(function(res2) {
        //console.log(step + "query=" + JSON.stringify(res2));
        topviewT = res2[0].top;

        var swiperH = bottomB - topviewT + 20;
        console.log('resize ' + swiperH + "px");

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
        //jbr_ID: e.detail.value.jbr_ID,
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

              //wx.setStorageSync('has_registered', true);
              wx.redirectTo({
                url: 'index?step=2',
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
  stepto3: function(e){
    this.navStep(null, 3);
  },
  uploadSubmitTap: function(e) {

    if (!this.data.haveRegistered) {
      wx.showModal({
        title: '提示',
        content: '请先注册',
        showCancel: false,
      })
      return;
    }
    if (this.data.u_license && this.data.u_ticket) {} else {
      wx.showModal({
        title: '提示',
        content: '请先上传执照和汇款凭证',
        showCancel: false,
      })
      return;
    }
    //console.log(e)
    var that = this;
    var juser = wx.getStorageSync('juser');
    wx.request({
      url: 'https://wx.gzis.org.cn/dszr/web/index.php/apply/uploadSubmitAjax',
      method: 'POST',
      data: {
        'sec': app.globalData.secret,
        'userid': juser.id,
      },
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data == 'OK') {
          console.log('upload file submit success.')
          that.setData({
            u_submit: true
          });
          wx.setStorageSync('u_submit', true);

          wx.showModal({
            title: '提示',
            content: '提交成功！',
            showCancel: false,
            complete: function () {
              wx.redirectTo({
                url: 'index?step=3',
              })
            }
          });
        }

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