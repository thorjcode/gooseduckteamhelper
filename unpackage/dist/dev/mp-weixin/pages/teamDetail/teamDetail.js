"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      begin: false,
      Id: "",
      TeamList: []
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.Id = options.id;
    console.log("传过来的id", options.id);
    this.getTeamInfo();
  },
  //分享给朋友
  onShareAppMessage: function(option) {
    let shareTitle = this.TeamList[0].teamName;
    let shareImg = this.TeamList[0].captainHeahImg;
    let shareTeamId = this.TeamList[0].teamId;
    let shaerId = this.TeamList[0]._id;
    let shareobj = {
      title: shareTitle + ",房间号：" + shareTeamId,
      //分享的标题
      path: "pages/teamDetail/teamDetail?id=" + shaerId,
      //好友点击分享之后跳转的页面
      imageUrl: shareImg
      //分享的图片
    };
    return shareobj;
  },
  methods: {
    //查询队伍信息
    getTeamInfo() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let Id = this.Id;
      db.collection("TeamHall").where({
        "_id": Id
      }).get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("获取我的组队数据成功：", res.result.data);
        if (res.result.data.length > 0) {
          this.TeamList = res.result.data;
          this.begin = res.result.data[0].begin;
        } else {
          common_vendor.index.showModal({
            title: "温馨提示",
            content: "该队伍已解散，去大厅看看吧",
            showCancel: false,
            confirmText: "返回大厅",
            success: (res2) => {
              if (res2.confirm) {
                console.log("用户点击确定");
                common_vendor.index.redirectTo({
                  url: "/pages/index/index"
                });
              }
            }
          });
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("获取我的组队数据失败：", err);
      });
    },
    // 复制房间号
    copyTeamId(e) {
      common_vendor.index.setClipboardData({
        data: e.currentTarget.dataset.id
      });
    },
    // 开始游戏
    BeginBtn() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let Id = this.Id;
      db.collection("TeamHall").doc(Id).update({
        begin: true,
        beginTime: new Date()
      }).then((res) => {
        common_vendor.index.hideLoading();
        console.log("开始游戏成功", res);
        common_vendor.index.navigateBack({
          delta: 1
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("开始游戏失败", err);
        common_vendor.index.showToast({
          title: "网络错误，开始失败！",
          icon: "error",
          duration: 1e3
        });
      });
    },
    // 删除提示
    deleteBarModal() {
      common_vendor.index.showModal({
        title: "温馨提醒",
        content: "确定解散该队伍吗",
        mask: true,
        success: (res) => {
          if (res.confirm) {
            this.deleteTeam();
          }
        }
      });
    },
    // 解散队伍
    deleteTeam() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let Id = this.Id;
      db.collection("TeamHall").doc(Id).remove({}).then((res) => {
        common_vendor.index.hideLoading();
        console.log("解散成功", res);
        common_vendor.index.navigateBack({
          delta: 1
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("开始游戏失败", err);
        common_vendor.index.showToast({
          title: "网络错误，解散失败！",
          icon: "error",
          duration: 1e3
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.TeamList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.teamId),
        b: item.teamId,
        c: common_vendor.o((...args) => $options.copyTeamId && $options.copyTeamId(...args), item._id),
        d: common_vendor.t(item.teamName),
        e: common_vendor.t(item.begin ? "已开始" : "准备中"),
        f: common_vendor.s(item.begin ? "background-color: #00CC66;" : ""),
        g: common_vendor.t(item.teamType),
        h: item.modeImg,
        i: common_vendor.t(item.modeName),
        j: item.mapImg,
        k: common_vendor.t(item.mapName),
        l: item._id
      };
    }),
    b: common_assets._imports_0
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/teamDetail/teamDetail.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
