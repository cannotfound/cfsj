import WxValidate from 'WxValidate.js';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * sdf
 */
function showModal(error) {
  wx.showModal({
    content: error.msg,
    showCancel: false,
  })
}
module.exports = {
  wxlogin: wxlogin,
  getRegisterInfo: getRegisterInfo,
  initValidate: initValidate,
  isBlank: isBlank,
  formatTime: formatTime,
  showModal: showModal,
}

const app = getApp()
function wxlogin(page){
  var that = page;
  wx.login({
    
    success: function (res) {
      //console.log(res);

      wx.request({
        url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/authcodeAjax',
        method: "POST",
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
        data: { code: res.code, sec: app.globalData.secret, },
        success: function (res) {

          if (res.data == 'error') return;
          console.log("authcode success..");
          //console.log(res);
          var openid = res.data;
          that.setData({
            wxopenid: openid
          });
          
          wx.setStorageSync('openid', openid);
          getRegisterInfo(that);

        },
        fail: function (ex) {
          console.log(ex.errMsg + ":authcode");
        }
      })

    }

  })
}

function getRegisterInfo(page){
  var that = page;
  var wxopenid = wx.getStorageSync('openid');
  wx.request({
    url: 'https://wx.gzis.org.cn/dszr/web/index.php/index/GetUserAjax',
    method: 'POST',
    header: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: { openid: wxopenid, sec: app.globalData.secret },
    success: function (res) {
      console.log(res)

      if (!res.data.org_name) {
        console.log('真可怕！它没有绑定法人');
      } else {

        wx.setStorageSync('juser', res.data);
        that.setData({
          register_org_name: res.data.org_name,
          haveRegistered: true,
        });


      }
    },
    complete: function (res) {
      wx.hideLoading();
    }
  })

}

function initValidate(page) {
  const rules = {
    org_name: {
      required: true,
      minlength: 2,
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
  page.WxValidate = new WxValidate(rules, messages);
}