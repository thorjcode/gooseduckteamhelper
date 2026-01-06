"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/createTeam/createTeam.js";
  "./pages/me/me.js";
  "./pages/myTeamDetail/myTeamDetail.js";
  "./pages/teamDetail/teamDetail.js";
  "./pages/backstage/backstageHome/backstageHome.js";
  "./pages/backstage/miniApp/miniApp.js";
  "./pages/backstage/addHeadImg/addHeadImg.js";
  "./pages/backstage/addTeamType/addTeamType.js";
  "./pages/backstage/addGameMode/addGameMode.js";
  "./pages/backstage/addGameMap/addGameMap.js";
  "./pages/backstage/adminList/adminList.js";
  "./pages/backstage/addAdmin/addAdmin.js";
  "./pages/backstage/addMeTopBg/addMeTopBg.js";
  "./pages/backstage/addNotice/addNotice.js";
}
const _sfc_main = {
  globalData: {
    userInfo: {},
    openid: null,
    UserLogin: false
    //检测是否登录函数，未登录则提示登录
  },
  onLaunch: function() {
    console.log("App Launch");
    this.getOpenid();
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    // 获取当前运行设备
    getSysInfo() {
      let sys = common_vendor.index.getSystemInfoSync();
      console.log("运行设备：", sys);
      if (sys.deviceModel == "PC") {
        console.log("当前运行在PC");
        this.haslogin();
      } else {
        console.log("当前运行在非PC");
        if (sys.hostName == "WeChat") {
          this.haslogin();
        }
      }
    },
    // 获取openid
    getOpenid() {
      var app = this;
      var openidStor = common_vendor.index.getStorageSync("openid");
      if (openidStor) {
        console.log("本地获取openid成功：", openidStor);
        app.globalData.openid = openidStor;
        this.haslogin();
      } else {
        common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            if (res.code) {
              common_vendor.Ls.callFunction({
                name: "getOpenid",
                data: {
                  action: "code2Session",
                  js_code: res.code
                },
                success: (res2) => {
                  console.log("云函数获取openid成功：", res2.result);
                  if (res2.result.data.openid) {
                    common_vendor.index.setStorageSync("openid", res2.result.data.openid);
                    app.globalData.openid = openid;
                    this.haslogin();
                  }
                },
                fail: (err) => {
                  console.log("云函数获取openid失败：", err);
                }
              });
            }
          }
        });
      }
    },
    // 登录状态
    haslogin() {
      var userInfo = common_vendor.index.getStorageSync("UserInfo");
      if (userInfo != "") {
        console.log("已登录");
        this.globalData.userInfo = userInfo;
        this.globalData.UserLogin = true;
      } else {
        console.log("未登录");
        this.globalData.userInfo = null;
        this.globalData.UserLogin = false;
      }
    }
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/uniapp-project/gooseduckteamhelper/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
