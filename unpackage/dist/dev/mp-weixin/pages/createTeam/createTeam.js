"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      openId: "",
      SysTeamType: [],
      SysGameMode: [],
      SysGameMap: [],
      headImg: "",
      teamId: "",
      teamName: "",
      typeid: "",
      teamType: "",
      modeid: "",
      modeName: "",
      modeImg: "",
      mapid: "",
      mapName: "",
      mapImg: "",
      age: "18"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log("创建队伍onLoad");
    this.openId = common_vendor.index.getStorageSync("openid");
    this.getUserInfo();
    this.getSysTeamType();
    this.getSysGameMode();
    this.getGameMap();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      let UserInfo = common_vendor.index.getStorageSync("UserInfo");
      console.log("缓存里的用户信息：", UserInfo);
      if (UserInfo != "") {
        this.age = UserInfo.age;
        this.teamName = UserInfo.name + "的队伍";
        this.headImg = UserInfo.headImg;
      } else {
        common_vendor.index.showModal({
          title: "温馨提示",
          content: "为了更好的匹配队友，先去完善一些信息吧",
          success: (res) => {
            if (res.confirm) {
              console.log("用户点击确定");
              common_vendor.index.navigateTo({
                url: "/pages/me/me"
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
              this.age = "18";
            }
          }
        });
      }
    },
    // 获取系统队伍类型信息
    getSysTeamType() {
      db.collection("SysTeamType").get().then((res) => {
        console.log("查询队伍类型成功：", res.result.data);
        this.SysTeamType = res.result.data;
      }).catch((err) => {
        console.log("查询队伍类型失败：", err);
      });
    },
    // 获取系统游戏模式信息
    getSysGameMode() {
      db.collection("SysGameMode").get().then((res) => {
        console.log("查询游戏模式成功：", res.result.data);
        this.SysGameMode = res.result.data;
      }).catch((err) => {
        console.log("查询游戏模式失败：", err);
      });
    },
    // 获取系统游戏地图信息
    getGameMap() {
      db.collection("SysGameMap").get().then((res) => {
        console.log("查询游戏地图成功：", res.result.data);
        this.SysGameMap = res.result.data;
      }).catch((err) => {
        console.log("查询游戏地图失败：", err);
      });
    },
    // 填写房间号
    inputTeamId(e) {
      console.log("获取输入房间号成功", e.detail.value);
      this.teamId = e.detail.value;
    },
    // 填写队伍名
    inputTeamName(e) {
      console.log("获取输入队伍名成功", e.detail.value);
      this.teamName = e.detail.value;
    },
    // 点击队伍类型
    clickTeamType(e) {
      let itemid = e.currentTarget.dataset.itemid;
      let teamType = e.currentTarget.dataset.type;
      console.log("点击队伍类型：", itemid, e);
      if (this.typeid == itemid) {
        this.typeid = "";
        this.teamType = "";
      } else {
        this.typeid = itemid;
        this.teamType = teamType;
      }
    },
    // 点击游戏模式
    clickGameMode(e) {
      let itemid = e.currentTarget.dataset.itemid;
      let modeName = e.currentTarget.dataset.name;
      let modeImg = e.currentTarget.dataset.img;
      console.log("点击游戏模式：", itemid, e);
      if (this.modeid == itemid) {
        this.modeid = "";
        this.modeName = "";
        this.modeImg = "";
      } else {
        this.modeid = itemid;
        this.modeName = modeName;
        this.modeImg = modeImg;
      }
    },
    // 点击游戏地图
    clickGameMap(e) {
      let itemid = e.currentTarget.dataset.itemid;
      let mapName = e.currentTarget.dataset.name;
      let mapImg = e.currentTarget.dataset.img;
      console.log("点击游戏地图：", itemid, e);
      if (this.mapid == itemid) {
        this.mapid = "";
        this.mapName = "";
        this.mapImg = "";
      } else {
        this.mapid = itemid;
        this.mapName = mapName;
        this.mapImg = mapImg;
      }
    },
    /**
     * 确认提交按钮
     */
    SubmitBtn(e) {
      let teamId = this.teamId;
      let teamName = this.teamName;
      let teamType = this.teamType;
      let modeName = this.modeName;
      let mapName = this.mapName;
      console.log("确认提交按钮里的位置信息：", teamId, teamName, teamType, modeName, mapName);
      if (teamId == "") {
        common_vendor.index.showToast({
          title: "请填写房间号！",
          icon: "none",
          duration: 1e3
        });
      } else if (teamName == "") {
        common_vendor.index.showToast({
          title: "请填写队伍名！",
          duration: 1e3,
          icon: "none"
        });
      } else if (teamType == "") {
        common_vendor.index.showToast({
          title: "请选择队伍类型！",
          duration: 1e3,
          icon: "none"
        });
      } else if (modeName == "") {
        common_vendor.index.showToast({
          title: "请选择游戏模式！",
          duration: 1e3,
          icon: "none"
        });
      } else if (mapName == "") {
        common_vendor.index.showToast({
          title: "请选择游戏地图！",
          duration: 1e3,
          icon: "none"
        });
      } else {
        this.SubmitData();
      }
    },
    // 提交数据
    SubmitData() {
      let openId = this.openId;
      let teamId = this.teamId;
      let headImg = this.headImg;
      let teamName = this.teamName;
      let teamType = this.teamType;
      let modeName = this.modeName;
      let modeImg = this.modeImg;
      let mapName = this.mapName;
      let mapImg = this.mapImg;
      let age = this.age;
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      db.collection("TeamHall").add({
        openid: openId,
        teamId,
        captainHeahImg: headImg,
        teamName,
        teamType,
        modeName,
        modeImg,
        mapName,
        mapImg,
        age,
        minute: 15,
        begin: false,
        valid: true,
        publishTime: new Date()
      }).then((res) => {
        common_vendor.index.hideLoading();
        console.log("写入成功", res.errMsg, res);
        common_vendor.index.navigateBack({
          delta: 1
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("写入失败", err);
        common_vendor.index.showToast({
          title: "录入失败，请检查网络后重试！",
          icon: "none",
          mask: true,
          duration: 1e3
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.inputTeamId && $options.inputTeamId(...args)),
    b: $data.teamName,
    c: common_vendor.o((...args) => $options.inputTeamName && $options.inputTeamName(...args)),
    d: common_vendor.f($data.SysTeamType, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.teamType),
        b: item._id,
        c: item.teamType,
        d: common_vendor.o((...args) => $options.clickTeamType && $options.clickTeamType(...args), item._id),
        e: common_vendor.n($data.typeid == item._id ? "item_ckd" : ""),
        f: item._id
      };
    }),
    e: common_vendor.f($data.SysGameMode, (item, k0, i0) => {
      return {
        a: item.modeImg,
        b: item._id,
        c: item.modeName,
        d: item.modeImg,
        e: common_vendor.o((...args) => $options.clickGameMode && $options.clickGameMode(...args), item._id),
        f: common_vendor.t(item.modeName),
        g: common_vendor.n($data.modeid == item._id ? "item_ckd" : ""),
        h: item._id
      };
    }),
    f: common_vendor.f($data.SysGameMap, (item, k0, i0) => {
      return {
        a: item.mapImg,
        b: item._id,
        c: item.mapName,
        d: item.mapImg,
        e: common_vendor.o((...args) => $options.clickGameMap && $options.clickGameMap(...args), item._id),
        f: common_vendor.t(item.mapName),
        g: common_vendor.n($data.mapid == item._id ? "item_ckd" : ""),
        h: item._id
      };
    }),
    g: common_vendor.o((...args) => $options.SubmitBtn && $options.SubmitBtn(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/createTeam/createTeam.vue"]]);
wx.createPage(MiniProgramPage);
