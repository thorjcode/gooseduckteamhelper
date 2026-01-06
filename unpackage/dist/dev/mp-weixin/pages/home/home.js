"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      UserLogin: false,
      //检测是否登录函数，未登录则提示登录
      age: "18",
      type: "teamhall",
      teamhallNav: true,
      myteamNav: false,
      notice: "欢迎使用鹅鸭杀组队小程序，本程序只发布房间号，不创建任何聊天群，请注意保护个人信息财产安全，请大家素质游戏更快乐",
      page: 0,
      total: 0,
      TeamhallList: [],
      Myteamlist: [],
      interval: ""
    };
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log("首页onLoad");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("首页onShow");
    this.getUserInfo();
    this.getSysNotice();
    let type = this.type;
    let page = this.page;
    console.log("默认的导航栏：", type);
    if (type == "teamhall") {
      this.TeamhallList = [];
      this.getTeamhall(page);
    }
    if (type == "myteam") {
      this.Myteamlist = [];
      this.getMyteam();
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("首页onHide");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("首页onUnload");
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    common_vendor.index.showNavigationBarLoading();
    let type = this.type;
    console.log("下拉当前的导航栏：", type);
    if (type == "teamhall") {
      this.TeamhallList = [];
      this.getTeamhall(this.page);
    }
    if (type == "myteam") {
      this.Myteamlist = [];
      this.getMyteam();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let type = this.type;
    if (type == "teamhall") {
      let total = this.total;
      let TeamhallList = this.TeamhallList;
      if (TeamhallList.length < total) {
        let page = TeamhallList.length;
        this.getTeamhall(page);
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "没有数据了哟",
          duration: 1e3
        });
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  //分享给朋友
  onShareAppMessage: function() {
    return {
      title: "鹅鸭杀组队小程序.组队大厅"
    };
  },
  //分享朋友圈
  onShareTimeline: function() {
    return {
      title: "鹅鸭杀组队小程序.组队大厅"
      // query: this.TeamList[0],
    };
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      let UserInfo = common_vendor.index.getStorageSync("UserInfo");
      console.log("缓存里的用户信息：", UserInfo);
      if (UserInfo != "") {
        this.age = UserInfo.age;
        this.UserLogin = true;
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
    // 获取系统通知内容
    getSysNotice() {
      db.collection("SysNotice").get().then((res) => {
        console.log("获取系统通知内容成功：", res.result.data);
        if (res.result.data[0].notice != "") {
          this.notice = res.result.data[0].notice;
        }
      }).catch((err) => {
        console.log("获取系统通知内容失败：", err);
      });
    },
    // 切换导航栏
    ChangeTab(e) {
      let type = e.currentTarget.dataset.type;
      if (type == "teamhall") {
        this.TeamhallList = [];
        this.teamhallNav = true;
        this.myteamNav = false;
        this.type = "teamhall";
        this.getTeamhall(this.page);
      }
      if (type == "myteam") {
        this.Myteamlist = [];
        this.teamhallNav = false;
        this.myteamNav = true;
        this.type = "myteam";
        this.getMyteam();
      }
    },
    // 查询数据总数
    DocTeamhallCount() {
      db.collection("TeamHall").where({
        "valid": true
      }).count().then((res) => {
        console.log("查询大厅总条数成功：", res);
        this.total = res.result.total;
      }).catch((err) => {
        console.log("查询大厅总条数失败：", err);
      });
    },
    // 获取组队大厅
    getTeamhall(page) {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      clearInterval(this.interval);
      this.interval = "";
      this.TeamhallList = [];
      let age = this.age;
      db.collection("TeamHall").where({
        "age": age,
        "valid": true
      }).orderBy("publishTime", "desc").skip(page).limit(10).get().then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.hideNavigationBarLoading();
        console.log("获取组队大厅数据成功：", res.result.data);
        this.TeamhallList = res.result.data;
        this.updTime(res.result.data);
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.hideNavigationBarLoading();
        console.log("获取组队大厅数据失败：", err);
      });
    },
    // 获取我的队伍
    getMyteam() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let openId = common_vendor.index.getStorageSync("openid");
      console.log("用户openid：", openId);
      db.collection("TeamHall").where({
        "openid": openId,
        "valid": true
      }).get().then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.hideNavigationBarLoading();
        console.log("获取我的组队数据成功：", res.result.data);
        this.Myteamlist = res.result.data;
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.hideNavigationBarLoading();
        console.log("获取我的组队数据失败：", err);
      });
    },
    // 复制房间号
    copyTeamId(e) {
      common_vendor.index.setClipboardData({
        data: e.currentTarget.dataset.id
      });
    },
    // 跳转我的队伍详情	
    goTeamDetail(e) {
      console.log("跳转大厅队伍详情:", e);
      let url = "/pages/teamDetail/teamDetail";
      let id = e.currentTarget.dataset.id;
      common_vendor.index.navigateTo({
        url: `${url}?id=${id}`
      });
    },
    // 跳转我的队伍详情
    goMyTeamDetail(e) {
      console.log("跳转我的队伍详情:", e);
      let url = "/pages/myTeamDetail/myTeamDetail";
      let id = e.currentTarget.dataset.id;
      common_vendor.index.navigateTo({
        url: `${url}?id=${id}`
      });
    },
    // 跳转创建队伍
    goCreateTeam() {
      console.log("跳转创建队伍", this.UserLogin);
      if (this.UserLogin == true) {
        common_vendor.index.navigateTo({
          url: "/pages/createTeam/createTeam"
        });
      } else {
        common_vendor.index.showModal({
          title: "温馨提示",
          content: "请先完善一些信息再去创建队伍吧",
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
    // 跳转个人中心
    goMePage() {
      common_vendor.index.navigateTo({
        url: "/pages/me/me"
      });
    },
    // 定时更新时间
    updTime(e) {
      console.log("定时更新方法：", e);
      this.interval = setInterval(() => {
        this.getTeamhall(this.page);
        e.forEach((item) => {
          console.log("id：", item._id, "时间：", item.minute);
          for (let i = 0; i < e.length; i++) {
            if (item.minute == 0) {
              db.collection("TeamHall").doc(item._id).remove({}).then((res) => {
                common_vendor.index.hideLoading();
                console.log("时间到解散队伍成功", res);
              }).catch((err) => {
                common_vendor.index.hideLoading();
                console.log("时间到解散队伍失败", err);
              });
            } else {
              db.collection("TeamHall").doc(item._id).update({
                minute: item.minute - 1
              }).then((res) => {
                console.log("更新时间成功：", res);
              }).catch((err) => {
                console.log("更新时间失败：", err);
              });
            }
          }
        });
      }, 6e4);
    },
    // 倒计时到
    timeup() {
      console.log("时间到：");
    }
  }
};
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_countdown2 = common_vendor.resolveComponent("uni-countdown");
  (_easycom_uni_notice_bar2 + _easycom_uni_countdown2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_countdown = () => "../../uni_modules/uni-countdown/components/uni-countdown/uni-countdown.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_countdown)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.teamhallNav ? "nav_color" : ""),
    b: common_vendor.o((...args) => $options.ChangeTab && $options.ChangeTab(...args)),
    c: common_vendor.n($data.myteamNav ? "nav_color" : ""),
    d: common_vendor.o((...args) => $options.ChangeTab && $options.ChangeTab(...args)),
    e: common_vendor.p({
      speed: 70,
      ["show-icon"]: true,
      scrollable: true,
      color: "#fff",
      backgroundColor: "",
      text: $data.notice
    }),
    f: $data.teamhallNav
  }, $data.teamhallNav ? {
    g: common_vendor.f($data.TeamhallList, (item, k0, i0) => {
      return {
        a: item.mapImg,
        b: item.captainHeahImg ? item.captainHeahImg : "../../static/iconimg/ganyu.jpg",
        c: common_vendor.t(item.teamId),
        d: item.teamId,
        e: common_vendor.o((...args) => $options.copyTeamId && $options.copyTeamId(...args), item._id),
        f: common_vendor.t(item.teamName),
        g: common_vendor.t(item.begin ? "已开始" : "准备中"),
        h: common_vendor.s(item.begin ? "background-color: #00cc33;" : "background-color: #ff9933;"),
        i: common_vendor.t(item.mapName),
        j: common_vendor.t(item.modeName),
        k: common_vendor.o(($event) => $options.timeup(), item._id),
        l: "4904191b-1-" + i0,
        m: common_vendor.p({
          ["font-size"]: "12",
          color: "#FFFFFF",
          splitorColor: "#FFFFFF",
          ["show-day"]: false,
          hour: item.hour,
          minute: item.minute,
          second: item.second
        }),
        n: item._id,
        o: common_vendor.o((...args) => $options.goTeamDetail && $options.goTeamDetail(...args), item._id),
        p: item._id
      };
    }),
    h: common_assets._imports_0
  } : {}, {
    i: $data.teamhallNav && $data.TeamhallList.length == ""
  }, $data.teamhallNav && $data.TeamhallList.length == "" ? {
    j: common_assets._imports_1
  } : {}, {
    k: $data.myteamNav
  }, $data.myteamNav ? {
    l: common_vendor.f($data.Myteamlist, (item, k0, i0) => {
      return {
        a: item.mapImg,
        b: item.captainHeahImg ? item.captainHeahImg : "../../static/iconimg/ganyu.jpg",
        c: common_vendor.t(item.teamId),
        d: item.teamId,
        e: common_vendor.o((...args) => $options.copyTeamId && $options.copyTeamId(...args), item._id),
        f: common_vendor.t(item.teamName),
        g: common_vendor.t(item.begin ? "已开始" : "准备中"),
        h: common_vendor.s(item.begin ? "background-color: #00CC33;" : "background-color: #ff9933;"),
        i: common_vendor.t(item.mapName),
        j: common_vendor.t(item.modeName),
        k: item._id,
        l: common_vendor.o($options.timeup, item._id),
        m: "4904191b-2-" + i0,
        n: common_vendor.p({
          ["font-size"]: "12",
          color: "#FFFFFF",
          splitorColor: "#FFFFFF",
          ["show-day"]: false,
          hour: item.hour,
          minute: item.minute,
          second: item.second
        }),
        o: item._id,
        p: common_vendor.o((...args) => $options.goMyTeamDetail && $options.goMyTeamDetail(...args), item._id),
        q: item._id
      };
    }),
    m: common_assets._imports_0
  } : {}, {
    n: $data.myteamNav && $data.Myteamlist.length == ""
  }, $data.myteamNav && $data.Myteamlist.length == "" ? {
    o: common_assets._imports_1
  } : {}, {
    p: $data.myteamNav && $data.Myteamlist.length == ""
  }, $data.myteamNav && $data.Myteamlist.length == "" ? {
    q: common_vendor.o((...args) => $options.goCreateTeam && $options.goCreateTeam(...args))
  } : {}, {
    r: $data.myteamNav
  }, $data.myteamNav ? {
    s: common_vendor.o((...args) => $options.goMePage && $options.goMePage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/home/home.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
