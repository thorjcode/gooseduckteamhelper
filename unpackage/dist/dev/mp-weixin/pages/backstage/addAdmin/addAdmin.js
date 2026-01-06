"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${[year, month, day].map(formatNumber).join("/")} ${[hour, minute].map(formatNumber).join(":")}`;
};
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
const _sfc_main = {
  data() {
    return {
      UserList: [],
      switch: false,
      total: 0,
      page: 0
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.page = 0;
    this.total = 0;
    this.UserList = [];
    this.getUser(this.page);
    this.DocCount();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let total = this.total;
    let UserList = this.UserList;
    if (UserList.length < total) {
      let page = UserList.length;
      this.getUser(page);
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
        "admin": false
      }).count().then((res) => {
        console.log("查询总条数成功：", res);
        this.total = res.result.total;
      }).catch((err) => {
        console.log("查询总条数失败：", err);
      });
    },
    // 查询普通用户
    getUser(page) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let ListArr = this.UserList;
      db.collection("DuckUsers").where({
        "admin": false
      }).skip(page).limit(10).orderBy("registerTime", "desc").get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("查询所有普通用户成功：", res);
        let data = res.result.data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            ListArr.push(data[i]);
          }
          this.UserList = ListArr;
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("查询所有普通用户失败：", err);
      });
    },
    // 添加管理员
    addAdmin(e) {
      console.log("点击了添加管理员", e);
      let userInfo = common_vendor.index.getStorageSync("UserInfo");
      let id = e.currentTarget.dataset.id;
      let value = e.detail.value;
      if (value) {
        common_vendor.index.showLoading({
          title: "加载中...",
          mask: true
        });
        db.collection("DuckUsers").doc(id).update({
          admin: true,
          level: Number("1"),
          operator: userInfo.name,
          addAdminTime: formatTime(new Date())
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
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.UserList, (item, index, i0) => {
      return {
        a: item.headImg,
        b: common_vendor.t(index + 1),
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.registerTime),
        e: item._id,
        f: common_vendor.o((...args) => $options.addAdmin && $options.addAdmin(...args), item._id),
        g: item._id
      };
    }),
    b: $data.switch,
    c: $data.total == ""
  }, $data.total == "" ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/addAdmin/addAdmin.vue"]]);
wx.createPage(MiniProgramPage);
