<script>
	export default {
		globalData: {
			userInfo: {},
			openid: null,
			UserLogin: false //检测是否登录函数，未登录则提示登录
		},
		onLaunch: function() {
			console.log('App Launch')
			// this.getSysInfo()
			this.getOpenid()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 获取当前运行设备
			getSysInfo() {
				let sys = uni.getSystemInfoSync()
				console.log("运行设备：", sys)
				if (sys.deviceModel == 'PC') {
					console.log("当前运行在PC")
					this.haslogin()
				} else {
					console.log("当前运行在非PC")
					if (sys.hostName == 'WeChat') {
						this.haslogin()
					}
				}
			},

			// 获取openid
			getOpenid() {
				var app = this;
				var openidStor = uni.getStorageSync('openid');
				if (openidStor) {
					console.log('本地获取openid成功：', openidStor);
					app.globalData.openid = openidStor;
					this.haslogin()
				} else {
					uni.login({
						provider: 'weixin',
						success: (res) => { // 获取 code
							if (res.code) {
								uniCloud.callFunction({
									name: 'getOpenid',
									data: {
										action: 'code2Session',
										js_code: res.code,
									},
									success: (res) => {
										console.log('云函数获取openid成功：', res.result)
										if (res.result.data.openid) {
											uni.setStorageSync('openid', res.result.data.openid)
											app.globalData.openid = openid;
											this.haslogin()
										}
									},
									fail: (err) => {
										console.log('云函数获取openid失败：', err)
									}
								})
							}
						}
					})
				}
			},

			// 登录状态
			haslogin() {
				var userInfo = uni.getStorageSync('UserInfo') // 获取缓存的登录信息
				if (userInfo != "") {
					console.log('已登录')
					this.globalData.userInfo = userInfo
					this.globalData.UserLogin = true
				} else {
					console.log('未登录')
					this.globalData.userInfo = null
					this.globalData.UserLogin = false
				}
			},
		}
	}
</script>

<style lang="scss">
	// 自定义全局样式
	@import './common/common.css';
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #403873;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
