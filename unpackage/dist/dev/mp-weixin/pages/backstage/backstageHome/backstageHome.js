"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 跳转函数
    Navigate(e) {
      let url = e.currentTarget.dataset.url;
      common_vendor.wx$1.navigateTo({
        url: `${url}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args)),
    b: common_vendor.o((...args) => $options.Navigate && $options.Navigate(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/uniapp-project/gooseduckteamhelper/pages/backstage/backstageHome/backstageHome.vue"]]);
wx.createPage(MiniProgramPage);
