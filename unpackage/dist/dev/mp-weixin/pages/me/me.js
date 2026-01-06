"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
getApp();
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
      UserLogin: false,
      admin: false,
      meTopImg: "",
      SysHeadImg: [],
      UId: "",
      openId: "",
      headImg: "",
      name: "",
      gender: "男",
      age: "18"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log("个人中心onLoad");
    this.getSysMeTopImg();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("个人中心onShow");
    this.openId = common_vendor.index.getStorageSync("openid");
    this.getUserInfo();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("个人中心onHide");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("个人中心onUnload");
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      let openId = this.openId;
      console.log("用户openid：", openId);
      db.collection("DuckUsers").where({
        "openid": openId
      }).get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("用openid查询用户成功：", res.result.data);
        let data = res.result.data[0];
        this.UId = data._id;
        this.headImg = data.headImg;
        this.name = data.name;
        this.gender = data.gender;
        this.age = data.age;
        this.admin = data.admin;
        common_vendor.index.setStorageSync("UserInfo", data);
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("用openid查询用户失败：", err);
      });
    },
    // 获取系统顶部背景图片
    getSysMeTopImg() {
      db.collection("SysMeTopImg").get().then((res) => {
        console.log("获取系统顶部背景图片成功：", res.result.data);
        if (res.result.data.length > 0) {
          this.meTopImg = res.result.data[0].meTopImg;
        }
      }).catch((err) => {
        console.log("获取系统顶部背景图片失败：", err);
      });
    },
    // 打开模态框
    toggle() {
      this.$refs.popup.open("bottom");
      this.getSysHeadimg();
    },
    // 获取系统头像图片
    getSysHeadimg() {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      db.collection("SysHeadImg").get().then((res) => {
        common_vendor.index.hideLoading();
        console.log("获取系统头像数据成功：", res.result.data);
        if (res.result.data.length > 0) {
          this.SysHeadImg = res.result.data;
        } else {
          let headArr = [];
          headArr.push({
            _id: "male002132441",
            sysHeadImg: "https://mp-03fe1f0f-7f8a-4957-9869-6fe45e570b5a.cdn.bspapp.com/cloudstorage/00b860d7-acfd-494e-b245-0adec3f5b3ce.jpg"
          }, {
            _id: "female002132361",
            sysHeadImg: "https://mp-03fe1f0f-7f8a-4957-9869-6fe45e570b5a.cdn.bspapp.com/cloudstorage/2473ce80-4356-49b8-b400-008bd10af899.jpg"
          });
          this.SysHeadImg = headArr;
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("获取系统头像数据失败：", err);
      });
    },
    // scroll-view滚动到底部
    lower(e) {
      console.log("滚动到底部：");
    },
    // 选择头像
    clickSudokuimg(e) {
      console.log("选择头像：", e.currentTarget.dataset.img);
      this.headImg = e.currentTarget.dataset.img;
    },
    // 填写昵称
    inputName(e) {
      console.log("获取输入昵称成功", e.detail.value);
      this.name = e.detail.value;
    },
    //点击性别项
    clickgender(e) {
      let gender = e.currentTarget.dataset.gender;
      console.log("点击性别项：", gender);
      if (gender == "男") {
        this.gender = "男";
      } else {
        this.gender = "女";
      }
    },
    //点击年龄项
    clickage(e) {
      let age = e.currentTarget.dataset.age;
      console.log("点击年龄项：", age);
      if (age == "16") {
        this.age = "16";
      } else {
        this.age = "18";
      }
    },
    // 确认提交按钮
    SubmitBtn() {
      let headImg = this.headImg;
      let name = this.name;
      let gender = this.gender;
      let age = this.age;
      let befUserInfo = common_vendor.index.getStorageSync("UserInfo");
      console.log("确认提交按钮里的位置信息：", name, gender, age, headImg);
      if (headImg == "") {
        common_vendor.index.showToast({
          title: "请选择头像！",
          icon: "none",
          duration: 1e3
        });
      } else if (name == "") {
        common_vendor.index.showToast({
          title: "请输入昵称！",
          duration: 1e3,
          icon: "none"
        });
      } else if (gender == "") {
        common_vendor.index.showToast({
          title: "请选择性别！",
          duration: 1e3,
          icon: "none"
        });
      } else if (age == "") {
        common_vendor.index.showToast({
          title: "请选择年龄！",
          duration: 1e3,
          icon: "none"
        });
      } else if (befUserInfo != "") {
        if (headImg == befUserInfo.headImg && name == befUserInfo.name && gender == befUserInfo.gender && age == befUserInfo.age) {
          common_vendor.index.showToast({
            title: "好像什么都没改变哦！",
            duration: 1e3,
            icon: "none"
          });
        } else {
          this.SubmitData();
        }
      } else {
        this.SubmitData();
      }
    },
    // 提交数据
    SubmitData() {
      let openId = this.openId;
      let Uid = this.UId;
      let headImg = this.headImg;
      let name = this.name;
      let gender = this.gender;
      let age = this.age;
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      db.collection("DuckUsers").where({
        "openid": openId
      }).get().then((res) => {
        console.log("用openid查询用户成功：", res.result.data);
        if (res.result.data.length == 0) {
          db.collection("DuckUsers").add({
            openid: openId,
            headImg,
            name,
            gender,
            age,
            level: Number(0),
            admin: false,
            registerTime: formatTime(new Date())
          }).then((res2) => {
            common_vendor.index.hideLoading();
            console.log("写入成功", res2);
            this.getUserInfo();
            common_vendor.index.showToast({
              title: "录入成功",
              icon: "success",
              duration: 1e3
            });
          }).catch((err) => {
            common_vendor.index.hideLoading();
            console.log("写入失败", err);
            common_vendor.index.showToast({
              title: "录入失败",
              icon: "error",
              duration: 1e3
            });
          });
        } else {
          db.collection("DuckUsers").doc(Uid).update({
            headImg,
            name,
            gender,
            age,
            updateTime: formatTime(new Date())
          }).then((res2) => {
            common_vendor.index.hideLoading();
            console.log("更新成功", res2);
            this.getUserInfo();
            common_vendor.index.showToast({
              title: "更新成功",
              icon: "success",
              duration: 1e3
            });
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
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("用openid查询用户失败：", err);
      });
    },
    // 跳转后台页面
    goStagedoor() {
      common_vendor.index.navigateTo({
        url: "/pages/backstage/backstageHome/backstageHome"
      });
    },
    // 返回上一页
    backPage() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.meTopImg != "" ? $data.meTopImg : "../../static/iconimg/defmetopbg.png",
    b: $data.headImg != "" ? $data.headImg : "../../static/iconimg/addheadimg.png",
    c: common_vendor.o((...args) => $options.toggle && $options.toggle(...args)),
    d: common_vendor.f($data.SysHeadImg, (item, k0, i0) => {
      return {
        a: item.sysHeadImg,
        b: item.sysHeadImg,
        c: common_vendor.o((...args) => $options.clickSudokuimg && $options.clickSudokuimg(...args), item._id),
        d: item._id
      };
    }),
    e: common_vendor.o((...args) => $options.lower && $options.lower(...args)),
    f: common_vendor.sr("popup", "7ea0a87b-0"),
    g: common_vendor.p({
      safeArea: true,
      backgroundColor: "#fff"
    }),
    h: $data.name,
    i: common_vendor.o((...args) => $options.inputName && $options.inputName(...args)),
    j: common_vendor.n($data.gender == "男" ? "item_ckd" : ""),
    k: common_vendor.o((...args) => $options.clickgender && $options.clickgender(...args)),
    l: common_vendor.n($data.gender == "女" ? "item_ckd" : ""),
    m: common_vendor.o((...args) => $options.clickgender && $options.clickgender(...args)),
    n: common_vendor.n($data.age == "18" ? "item_ckd" : ""),
    o: common_vendor.o((...args) => $options.clickage && $options.clickage(...args)),
    p: common_vendor.n($data.age == "16" ? "item_ckd" : ""),
    q: common_vendor.o((...args) => $options.clickage && $options.clickage(...args)),
    r: common_vendor.o((...args) => $options.SubmitBtn && $options.SubmitBtn(...args)),
    s: common_vendor.o((...args) => $options.backPage && $options.backPage(...args)),
    t: common_assets._imports_0$1,
    v: $data.admin
  }, $data.admin ? {
    w: common_assets._imports_1$1,
    x: common_vendor.o((...args) => $options.goStagedoor && $options.goStagedoor(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/me/me.vue"]]);
wx.createPage(MiniProgramPage);
