"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      id: "",
      inputValue: ""
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getSysNotice();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    common_vendor.index.removeStorageSync("befNotice");
  },
  methods: {
    // 获取系统通知内容
    getSysNotice() {
      db.collection("SysNotice").get().then((res) => {
        console.log("获取系统通知内容成功：", res.result.data);
        if (res.result.data.length > 0) {
          this.id = res.result.data[0]._id;
          this.inputValue = res.result.data[0].notice;
          common_vendor.index.setStorageSync("befNotice", res.result.data[0].notice);
        }
      }).catch((err) => {
        console.log("获取系统通知内容失败：", err);
      });
    },
    /**
     * 获取输入框数据
     */
    inputData(e) {
      this.inputValue = e.detail.value;
    },
    //取消按钮
    closeInput() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    /**
     * 确认提交按钮
     */
    confirmSubmit() {
      let inputValue = this.inputValue;
      let befNotice = common_vendor.index.getStorageSync("befNotice");
      if (inputValue == befNotice) {
        common_vendor.index.showToast({
          title: "请填写新的内容！",
          duration: 1e3,
          icon: "none"
        });
      } else {
        this.addData();
      }
    },
    /**
     * 添加数据
     */
    addData() {
      let id = this.id;
      if (id == "") {
        common_vendor.index.showLoading({
          title: "添加中...",
          mask: true
        });
        let userInfo = common_vendor.index.getStorageSync("UserInfo");
        db.collection("SysNotice").add({
          notice: this.inputValue,
          editer: userInfo.name
        }).then((res) => {
          common_vendor.index.hideLoading();
          console.log("添加成功", res);
          common_vendor.index.showToast({
            title: "添加成功",
            icon: "success",
            duration: 1e3
          });
          this.getSysNotice();
        }).catch((err) => {
          common_vendor.index.hideLoading();
          console.log("添加失败", err);
          common_vendor.index.showToast({
            title: "网络错误，添加失败",
            icon: "error",
            duration: 1e3
          });
        });
      } else {
        common_vendor.index.showLoading({
          title: "更新中...",
          mask: true
        });
        let userInfo = common_vendor.index.getStorageSync("UserInfo");
        db.collection("SysNotice").doc(id).update({
          notice: this.inputValue,
          editer: userInfo.name,
          updateTime: new Date()
        }).then((res) => {
          common_vendor.index.hideLoading();
          console.log("更新成功", res);
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "success",
            duration: 1e3
          });
          this.getSysNotice();
        }).catch((err) => {
          common_vendor.index.hideLoading();
          console.log("更新失败", err);
          common_vendor.index.showToast({
            title: "更新失败",
            icon: "error",
            duration: 1e3
          });
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.inputValue,
    b: common_vendor.o((...args) => $options.inputData && $options.inputData(...args)),
    c: common_vendor.o((...args) => $options.closeInput && $options.closeInput(...args)),
    d: common_vendor.o((...args) => $options.confirmSubmit && $options.confirmSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/addNotice/addNotice.vue"]]);
wx.createPage(MiniProgramPage);
