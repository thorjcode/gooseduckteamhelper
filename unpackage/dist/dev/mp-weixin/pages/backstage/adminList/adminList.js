"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      switchAdmin: true,
      adminList: [],
      page: 0,
      total: 0,
      level: 0
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.page = 0;
    this.total = 0;
    this.adminList = [];
    this.getAdmin(this.page);
    this.DocCount();
    this.getUserInfo();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let total = this.total;
    let adminList = this.adminList;
    if (adminList.length < total) {
      let page = adminList.length;
      this.getAdmin(page);
    } else {
      common_vendor.index.showToast({
        icon: "none",
        title: "没有数据了哟",
        duration: 1e3
      });
    }
  },
  methods: {
    // 查询数据总数
    DocCount() {
      db.collection("DuckUsers").where({
        "admin": true
      }).count().then((res) => {
        console.log("查询总条数成功：", res);
        this.total = res.result.total;
      }).catch((err) => {
        console.log("查询总条数失败：", err);
      });
    },
    // 查询所有管理员
    getAdmin(page) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let ListArr = this.adminList;
      db.collection("DuckUsers").where({
        "admin": true
      }).orderBy("level", "desc").skip(page).limit(10).get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("查询所有管理员成功：", res);
        let data = res.result.data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            ListArr.push(data[i]);
          }
          this.adminList = ListArr;
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("查询所有管理员失败：", err);
      });
    },
    // 获取用户信息
    getUserInfo() {
      let openId = common_vendor.index.getStorageSync("openid");
      console.log("用户openid：", openId);
      db.collection("DuckUsers").where({
        "openid": openId
      }).get().then((res) => {
        console.log("用openid查询用户成功：", res.result.data);
        let data = res.result.data[0];
        this.level = data.level;
      }).catch((err) => {
        console.log("用openid查询用户失败：", err);
      });
    },
    // 跳转添加新管理员页面
    addAdmin() {
      if (this.level === 2) {
        common_vendor.index.navigateTo({
          url: "../addAdmin/addAdmin"
        });
      } else {
        common_vendor.index.showToast({
          title: "没有权限！",
          icon: "none",
          duration: 1e3
        });
      }
    },
    // 关闭管理员
    switchChange(e) {
      console.log("关闭管理员：", e);
      if (this.level === 2) {
        let itemid = e.currentTarget.dataset.id;
        let itemlevel = e.currentTarget.dataset.level;
        let value = e.detail.value;
        if (value == false && itemlevel != 2) {
          common_vendor.index.showLoading({
            title: "加载中...",
            mask: true
          });
          db.collection("DuckUsers").doc(itemid).update({
            admin: false,
            level: Number("0")
          }).then((res) => {
            common_vendor.index.hideLoading();
            console.log("移除成功：", res.result.updated);
            if (res.result.updated > 0) {
              this.page = 0;
              this.total = 0;
              this.adminList = [];
              this.getAdmin(this.page);
              this.DocCount();
            }
          }).catch((err) => {
            common_vendor.index.hideLoading();
            console.log("移除失败：", err);
            this.switchAdmin = true;
          });
        } else {
          common_vendor.index.showToast({
            title: "超级管理员不能移除！请在PC端移除",
            icon: "none",
            duration: 1e3
          });
          this.switchAdmin = true;
        }
      } else {
        this.switchAdmin = true;
        common_vendor.index.showToast({
          title: "没有权限！",
          icon: "none",
          duration: 1e3
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.addAdmin && $options.addAdmin(...args)),
    b: common_vendor.f($data.adminList, (item, index, i0) => {
      return {
        a: item.headImg,
        b: common_vendor.t(index + 1),
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.level == "2" ? "超级管理员" : "普通管理员"),
        e: common_vendor.n(item.level == "2" ? "color_2" : "color_1"),
        f: common_vendor.t(item.level == "2" ? "超级管理员进入小程序端后台系统有全部功能使用权限，请谨慎操作！" : "普通管理员进入小程序端后台系统有使用“审核”功能权限，请谨慎操作！"),
        g: common_vendor.n(item.level == "2" ? "color_2" : "color_1"),
        h: common_vendor.t(item.operator),
        i: common_vendor.t(item.addAdminTime),
        j: item._id,
        k: item.level,
        l: common_vendor.o((...args) => $options.switchChange && $options.switchChange(...args), item._id),
        m: item._id
      };
    }),
    c: $data.switchAdmin
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/adminList/adminList.vue"]]);
wx.createPage(MiniProgramPage);
