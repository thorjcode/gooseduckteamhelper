"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Ls.database();
const _sfc_main = {
  data() {
    return {
      inputValue: "",
      Img: [],
      ImgID: [],
      isCoverImg: true
    };
  },
  methods: {
    /**
     * 获取输入框数据
     */
    inputData(e) {
      this.inputValue = e.detail.value;
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
      this.Img.splice(e.currentTarget.dataset.index, 1);
      this.isCoverImg = true;
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
      let inputValue = this.inputValue;
      if (inputValue == "") {
        common_vendor.index.showToast({
          title: "填写地图名称！",
          duration: 1e3,
          icon: "none"
        });
      } else if (Img.length == 0) {
        common_vendor.index.showToast({
          title: "请选择图片！",
          duration: 1e3,
          icon: "none"
        });
      } else {
        this.addImg();
      }
    },
    /**
     * 上传图片
     */
    addImg() {
      common_vendor.index.showLoading({
        title: "上传中...",
        mask: true
      });
      const fileName = this.Img[0];
      let cloudPath = this.inputValue + Date.now() + Math.floor(Math.random(0, 1) * 1e7) + ".jpg";
      common_vendor.Ls.uploadFile({
        cloudPath,
        filePath: fileName
      }).then((res) => {
        console.log("上传图片成功：", res);
        if (res.success) {
          db.collection("SysHeadImg").add({
            headName: this.inputValue,
            sysHeadImg: res.fileID
          }).then((res2) => {
            common_vendor.index.hideLoading();
            console.log("添加成功", res2);
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
      }).catch((err) => {
        common_vendor.index.hideLoading();
        console.log("上传图片失败：", err);
        common_vendor.index.showToast({
          title: "上传图片失败！",
          icon: "none",
          duration: 1e3
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.inputValue,
    b: common_vendor.o((...args) => $options.inputData && $options.inputData(...args)),
    c: common_vendor.t($data.Img.length),
    d: $data.isCoverImg
  }, $data.isCoverImg ? {
    e: common_vendor.o((...args) => $options.CoverImg && $options.CoverImg(...args))
  } : {
    f: $data.Img,
    g: common_vendor.o((...args) => $options.PWCoverImg && $options.PWCoverImg(...args)),
    h: common_vendor.o((...args) => $options.DECoverImg && $options.DECoverImg(...args))
  }, {
    i: common_vendor.o((...args) => $options.closeInput && $options.closeInput(...args)),
    j: common_vendor.o((...args) => $options.confirmSubmit && $options.confirmSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/addHeadImg/addHeadImg.vue"]]);
wx.createPage(MiniProgramPage);
