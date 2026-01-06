"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      TeamTypeList: [],
      GameModeList: [],
      GameMapList: [],
      SysHeadImgList: [],
      MeTopBgList: [],
      notice: "",
      editer: "暂无"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getSysNotice();
    this.getSysTeamType();
    this.getSysGameMode();
    this.getSysGameMap();
    this.getSysHeadimg();
    this.getSysMeTopImg();
  },
  methods: {
    // 获取系统通知内容
    getSysNotice() {
      db.collection("SysNotice").get().then((res) => {
        console.log("获取系统通知内容成功：", res.result.data);
        this.notice = res.result.data[0].notice;
        this.editer = res.result.data[0].editer;
      }).catch((err) => {
        console.log("获取系统通知内容失败：", err);
      });
    },
    // 获取系统队伍类型信息
    getSysTeamType() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      db.collection("SysTeamType").get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("查询队伍类型成功：", res.result.data);
        this.TeamTypeList = res.result.data;
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("查询队伍类型失败：", err);
      });
    },
    // 获取系统游戏模式信息
    getSysGameMode() {
      db.collection("SysGameMode").get().then((res) => {
        console.log("查询游戏模式成功：", res.result.data);
        this.GameModeList = res.result.data;
      }).catch((err) => {
        console.log("查询游戏模式失败：", err);
      });
    },
    // 获取系统游戏地图信息
    getSysGameMap() {
      db.collection("SysGameMap").get().then((res) => {
        console.log("查询游戏地图成功：", res.result.data);
        this.GameMapList = res.result.data;
      }).catch((err) => {
        console.log("查询游戏地图失败：", err);
      });
    },
    // 获取系统头像图片
    getSysHeadimg() {
      db.collection("SysHeadImg").get().then((res) => {
        console.log("获取系统头像数据成功：", res.result.data);
        this.SysHeadImgList = res.result.data;
      }).catch((err) => {
        console.log("获取系统头像数据失败：", err);
      });
    },
    // 获取系统顶部背景图片
    getSysMeTopImg() {
      db.collection("SysMeTopImg").get().then((res) => {
        console.log("获取系统顶部背景图片成功：", res.result.data);
        this.MeTopBgList = res.result.data;
      }).catch((err) => {
        console.log("获取系统顶部背景图片失败：", err);
      });
    },
    // 跳转函数
    Navigate(e) {
      let url = e.currentTarget.dataset.url;
      common_vendor.wx$1.navigateTo({
        url: `${url}`
      });
    },
    // 长按队伍类型
    longPressTeamType(e) {
      let id = e.currentTarget.dataset.id.trim();
      console.log("长按获取的id：", id);
      let name = e.currentTarget.dataset.name;
      console.log("长按获取的name：", name);
      common_vendor.index.showModal({
        title: "温馨提醒",
        content: `确定删除 ${name} ? 删除后将不可恢复！`,
        confirmText: "删除",
        confirmColor: "#ff0080",
        cancelText: "取消",
        mask: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "加载中...",
              mask: true
            });
            db.collection("SysTeamType").doc(id).remove({}).then((res2) => {
              common_vendor.index.hideLoading();
              console.log("删除成功", res2);
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success",
                duration: 1e3
              });
              this.getSysTeamType();
            }).catch((err) => {
              common_vendor.index.hideLoading();
              console.log("删除失败", err);
              common_vendor.index.showToast({
                title: "网络错误，操作失败！",
                icon: "error",
                duration: 1e3
              });
            });
          }
        }
      });
    },
    // 长按游戏模式
    longPressGameMode(e) {
      let id = e.currentTarget.dataset.id.trim();
      console.log("长按获取的id：", id);
      let name = e.currentTarget.dataset.name;
      console.log("长按获取的name：", name);
      let img = e.currentTarget.dataset.img;
      console.log("长按获取的img", img, typeof img);
      common_vendor.index.showModal({
        title: "温馨提醒",
        content: `确定删除 ${name} ? 删除后将不可恢复！`,
        confirmText: "删除",
        confirmColor: "#ff0080",
        cancelText: "取消",
        mask: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "加载中...",
              mask: true
            });
            let imgArr = [];
            imgArr.push(img);
            console.log("要删除的img", imgArr, typeof imgArr);
            common_vendor.Ls.callFunction({
              name: "deleteImgFile",
              data: {
                imgArr
              }
            }).then((res2) => {
              console.log("删除云存储文件成功：", res2);
              db.collection("SysGameMode").doc(id).remove({}).then((res3) => {
                common_vendor.index.hideLoading();
                console.log("删除成功", res3);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success",
                  duration: 1e3
                });
                this.getSysGameMode();
              }).catch((err) => {
                common_vendor.index.hideLoading();
                console.log("删除失败", err);
                common_vendor.index.showToast({
                  title: "网络错误，删除失败！",
                  icon: "error",
                  duration: 1e3
                });
              });
            }).catch((err) => {
              console.log("删除云存储文件失败：", err);
              common_vendor.index.hideLoading();
            });
          }
        }
      });
    },
    // 长按游戏地图
    longPressGameMap(e) {
      let id = e.currentTarget.dataset.id.trim();
      console.log("长按获取的id：", id);
      let name = e.currentTarget.dataset.name;
      console.log("长按获取的name：", name);
      let img = e.currentTarget.dataset.img;
      console.log("长按获取的img", img, typeof img);
      common_vendor.index.showModal({
        title: "温馨提醒",
        content: `确定删除 ${name} ? 删除后将不可恢复！`,
        confirmText: "删除",
        confirmColor: "#ff0080",
        cancelText: "取消",
        mask: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "加载中...",
              mask: true
            });
            let imgArr = [];
            imgArr.push(img);
            console.log("要删除的img", imgArr, typeof imgArr);
            common_vendor.Ls.callFunction({
              name: "deleteImgFile",
              data: {
                imgArr
              }
            }).then((res2) => {
              console.log("删除云存储文件成功：", res2);
              db.collection("SysGameMap").doc(id).remove({}).then((res3) => {
                common_vendor.index.hideLoading();
                console.log("删除成功", res3);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success",
                  duration: 1e3
                });
                this.getSysGameMap();
              }).catch((err) => {
                common_vendor.index.hideLoading();
                console.log("删除失败", err);
                common_vendor.index.showToast({
                  title: "网络错误，删除失败！",
                  icon: "error",
                  duration: 1e3
                });
              });
            }).catch((err) => {
              console.log("删除云存储文件失败：", err);
              common_vendor.index.hideLoading();
            });
          }
        }
      });
    },
    // 长按系统头像
    longPressHeadImg(e) {
      let id = e.currentTarget.dataset.id.trim();
      console.log("长按获取的id：", id);
      let name = e.currentTarget.dataset.name;
      console.log("长按获取的name：", name);
      let img = e.currentTarget.dataset.img;
      console.log("长按获取的img", img, typeof img);
      common_vendor.index.showModal({
        title: "温馨提醒",
        content: `确定删除 ${name} ? 删除后将不可恢复！`,
        confirmText: "删除",
        confirmColor: "#ff0080",
        cancelText: "取消",
        mask: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "加载中...",
              mask: true
            });
            let imgArr = [];
            imgArr.push(img);
            console.log("要删除的img", imgArr, typeof imgArr);
            common_vendor.Ls.callFunction({
              name: "deleteImgFile",
              data: {
                imgArr
              }
            }).then((res2) => {
              console.log("删除云存储文件成功：", res2);
              db.collection("SysHeadImg").doc(id).remove({}).then((res3) => {
                common_vendor.index.hideLoading();
                console.log("删除成功", res3);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success",
                  duration: 1e3
                });
                this.getSysHeadimg();
              }).catch((err) => {
                common_vendor.index.hideLoading();
                console.log("删除失败", err);
                common_vendor.index.showToast({
                  title: "网络错误，删除失败！",
                  icon: "error",
                  duration: 1e3
                });
              });
            }).catch((err) => {
              console.log("删除云存储文件失败：", err);
              common_vendor.index.hideLoading();
            });
          }
        }
      });
    },
    // 跳转编辑我的页面背景
    addMeTopBg() {
      common_vendor.wx$1.navigateTo({
        url: "../addMeTopBg/addMeTopBg"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    b: common_vendor.f($data.TeamTypeList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.teamType),
        b: item._id,
        c: item._id,
        d: item.teamType,
        e: common_vendor.o((...args) => $options.longPressTeamType && $options.longPressTeamType(...args), item._id)
      };
    }),
    c: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    d: common_vendor.f($data.GameModeList, (item, k0, i0) => {
      return {
        a: item.modeImg,
        b: common_vendor.t(item.modeName),
        c: item._id,
        d: item._id,
        e: item.modeName,
        f: item.modeImg,
        g: common_vendor.o((...args) => $options.longPressGameMode && $options.longPressGameMode(...args), item._id)
      };
    }),
    e: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    f: common_vendor.f($data.GameMapList, (item, k0, i0) => {
      return {
        a: item.mapImg,
        b: common_vendor.t(item.mapName),
        c: item._id,
        d: item._id,
        e: item.mapName,
        f: item.mapImg,
        g: common_vendor.o((...args) => $options.longPressGameMap && $options.longPressGameMap(...args), item._id)
      };
    }),
    g: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    h: common_vendor.f($data.SysHeadImgList, (item, k0, i0) => {
      return {
        a: item.sysHeadImg,
        b: common_vendor.t(item.headName),
        c: item._id,
        d: item._id,
        e: item.headName,
        f: item.sysHeadImg,
        g: common_vendor.o((...args) => $options.longPressHeadImg && $options.longPressHeadImg(...args), item._id)
      };
    }),
    i: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    j: common_vendor.f($data.MeTopBgList, (item, k0, i0) => {
      return {
        a: item.meTopImg,
        b: common_vendor.o((...args) => $options.addMeTopBg && $options.addMeTopBg(...args), item._id),
        c: item._id
      };
    }),
    k: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    l: common_vendor.t($data.notice),
    m: common_vendor.t($data.editer)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/miniApp/miniApp.vue"]]);
wx.createPage(MiniProgramPage);
