"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      inputValue: "",
      Img: [],
      isCoverImg: true
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getSysMeTopImg();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("添加我的页面背景onHide");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("添加我的页面背景onUnload");
    common_vendor.index.removeStorageSync("SysMeTopImg");
  },
  methods: {
    // 获取系统顶部背景图片
    getSysMeTopImg() {
      this.Img = [];
      this.isCoverImg = true;
      db.collection("SysMeTopImg").get().then((res) => {
        console.log("获取系统顶部背景图片成功：", res.result.data);
        if (res.result.data.length > 0) {
          this.Img.push(res.result.data[0].meTopImg);
          this.isCoverImg = false;
          common_vendor.index.setStorageSync("SysMeTopImg", res.result.data[0]);
        } else {
          this.Img = [];
          this.isCoverImg = true;
        }
      }).catch((err) => {
        console.log("获取系统顶部背景图片失败：", err);
      });
    },
    /**
     * 选择图片
     */
    CoverImg() {
      common_vendor.index.chooseImage({
        count: 1,
        //张数
        sizeType: ["compressed"],
        //压缩图
        sourceType: ["album"],
        //从相册选择
        success: (res) => {
          this.Img = res.tempFilePaths;
          this.isCoverImg = false;
        },
        fail: (err) => {
          console.log("获取图片失败", err);
          this.isCoverImg = true;
        }
      });
    },
    /**
     * 大图预览
     */
    PWCoverImg(e) {
      common_vendor.index.previewImage({
        //大图预览,需要的类型是数组
        urls: this.Img,
        current: e.currentTarget.dataset.url
      });
    },
    /**
     * 删除图片
     */
    DECoverImg(e) {
      console.log("点击了X删除图片，要删除的图片：", e.currentTarget.dataset.img);
      if (e.currentTarget.dataset.img[0].includes("http://tmp/") || e.currentTarget.dataset.img[0].includes(
        "wxfile://"
      )) {
        this.Img.splice(e.currentTarget.dataset.index, 1);
        this.isCoverImg = true;
      } else {
        this.delImg();
      }
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
    confirmSubmit(e) {
      let Img = this.Img;
      let befInfo = common_vendor.index.getStorageSync("SysMeTopImg");
      if (Img.length == 0) {
        common_vendor.index.showToast({
          title: "请选择图片！",
          duration: 1e3,
          icon: "none"
        });
      } else if (Img == befInfo.meTopImg) {
        common_vendor.index.showToast({
          title: "请选择新图片！",
          duration: 1e3,
          icon: "none"
        });
      } else {
        this.addImg();
      }
    },
    // 添加图片
    addImg() {
      common_vendor.index.showLoading({
        title: "上传中...",
        mask: true
      });
      const fileName = this.Img[0];
      let cloudPath = "metopimg" + Date.now() + Math.floor(Math.random(0, 1) * 1e7) + ".jpg";
      common_vendor.Ls.uploadFile({
        cloudPath,
        filePath: fileName
      }).then((res) => {
        console.log("上传图片成功：", res);
        if (res.success) {
          db.collection("SysMeTopImg").add({
            meTopImg: res.fileID
          }).then((res2) => {
            common_vendor.index.hideLoading();
            console.log("添加成功", res2);
            common_vendor.index.showToast({
              title: "添加成功",
              icon: "success",
              duration: 1e3
            });
            this.getSysMeTopImg();
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
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("上传图片失败：", err);
        common_vendor.index.showToast({
          title: "上传图片失败！",
          icon: "none",
          duration: 1e3
        });
      });
    },
    // 清除图片
    delImg() {
      common_vendor.index.showLoading({
        title: "清除中...",
        mask: true
      });
      let befInfo = common_vendor.index.getStorageSync("SysMeTopImg");
      let imgArr = [];
      imgArr.push(befInfo.meTopImg);
      common_vendor.Ls.callFunction({
        name: "deleteImgFile",
        data: {
          imgArr
        }
      }).then((res) => {
        console.log("删除云存储文件成功：", res);
        db.collection("SysMeTopImg").doc(befInfo._id).remove({}).then((res2) => {
          common_vendor.index.hideLoading();
          console.log("清除成功", res2);
          common_vendor.index.showToast({
            title: "清除成功",
            icon: "success",
            duration: 1e3
          });
          this.Img = [];
          common_vendor.index.removeStorageSync("SysMeTopImg");
          this.getSysMeTopImg();
        }).catch((err) => {
          common_vendor.index.hideLoading();
          console.log("清除失败", err);
          common_vendor.index.showToast({
            title: "网络错误，清除失败！",
            icon: "error",
            duration: 1e3
          });
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("删除云存储文件失败：", err);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.Img.length),
    b: $data.isCoverImg
  }, $data.isCoverImg ? {
    c: common_vendor.o((...args) => $options.CoverImg && $options.CoverImg(...args))
  } : {
    d: $data.Img,
    e: common_vendor.o((...args) => $options.PWCoverImg && $options.PWCoverImg(...args)),
    f: $data.Img,
    g: common_vendor.o((...args) => $options.DECoverImg && $options.DECoverImg(...args))
  }, {
    h: common_vendor.o((...args) => $options.closeInput && $options.closeInput(...args)),
    i: common_vendor.o((...args) => $options.confirmSubmit && $options.confirmSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/addMeTopBg/addMeTopBg.vue"]]);
wx.createPage(MiniProgramPage);
