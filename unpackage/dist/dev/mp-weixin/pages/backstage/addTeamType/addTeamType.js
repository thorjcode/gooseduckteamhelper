"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      teamType: ""
    };
  },
  methods: {
    /**
     * 获取输入框数据
     */
    inputData(e) {
      this.teamType = e.detail.value;
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
      let teamType = this.teamType;
      if (teamType == "") {
        common_vendor.index.showToast({
          title: "填写队伍类型！",
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
      common_vendor.index.showLoading({
        title: "添加中...",
        mask: true
      });
      db.collection("SysTeamType").add({
        teamType: this.teamType
      }).then((res) => {
        common_vendor.index.hideLoading();
        console.log("添加成功", res);
        common_vendor.index.showToast({
          title: "添加成功",
          icon: "success",
          duration: 1e3
        });
        common_vendor.index.navigateBack({
          delta: 1
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("添加失败", err);
        common_vendor.index.showToast({
          title: "网络错误，添加失败",
          icon: "error",
          duration: 1e3
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.teamType,
    b: common_vendor.o((...args) => $options.inputData && $options.inputData(...args)),
    c: common_vendor.o((...args) => $options.closeInput && $options.closeInput(...args)),
    d: common_vendor.o((...args) => $options.confirmSubmit && $options.confirmSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/addTeamType/addTeamType.vue"]]);
wx.createPage(MiniProgramPage);
