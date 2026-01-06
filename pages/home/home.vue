<template>
	<view class="main_page color_white">
		<!-- 顶部导航栏 -->
		<view class="topnav">
			<view class="navitem color_gold" data-type="teamhall" @click="ChangeTab">
				<text :class="teamhallNav?'nav_color':''">组队大厅</text>
			</view>
			<view class="navitem color_gold" data-type="myteam" @click="ChangeTab">
				<text :class="myteamNav?'nav_color':''">我的队伍</text>
			</view>
		</view>

		<!-- 通知栏 -->
		<view class="notice">
			<uni-notice-bar :speed="70" show-icon scrollable color="#fff" backgroundColor="" :text="notice" />
		</view>

		<!-- 组队大厅卡片 -->
		<view v-if="teamhallNav" class="card_box teamcard color_white" v-for="item in TeamhallList" :key="item._id">
			<image class="card_bg_img" :src="item.mapImg"></image>
			<view class="card" :data-id="item._id" @click="goTeamDetail">
				<view class="card_img">
					<image :src="item.captainHeahImg?item.captainHeahImg:'../../static/iconimg/ganyu.jpg'"></image>
				</view>
				<view class="card_text">
					<view class="card_text_row_box">
						<view class="card_text_h1" :data-id="item.teamId" @click="copyTeamId">房间：{{item.teamId}}
							<image class="copyimg" src="@/static/iconimg/copy.png"></image>
						</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">{{item.teamName}}</view>
						<view class="card_text_h2 begin_text"
							:style="item.begin?'background-color: #00cc33;':'background-color: #ff9933;'">
							{{item.begin?"已开始":"准备中"}}
						</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">地图：{{item.mapName}}</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">模式：{{item.modeName}}</view>
						<view class="countdown">
							<uni-countdown font-size="12" color="#FFFFFF" splitorColor="#FFFFFF" :show-day="false"
								:hour="item.hour" :minute="item.minute" :second="item.second" @timeup="timeup()" />
							<view>后解散</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 没有数据 -->
		<view v-if="teamhallNav && TeamhallList.length == ''" class="teamnull">
			<image src="@/static/iconimg/nodata.png"></image>
			<view>暂无数据</view>
		</view>

		<!-- 我的队伍卡片 -->
		<view v-if="myteamNav" class="card_box myteam color_white" v-for="item in Myteamlist" :key="item._id">
			<image class="card_bg_img" :src="item.mapImg"></image>
			<view class="card" :data-id="item._id" @click="goMyTeamDetail">
				<view class="card_img">
					<image :src="item.captainHeahImg?item.captainHeahImg:'../../static/iconimg/ganyu.jpg'"></image>
				</view>
				<view class="card_text">
					<view class="card_text_row_box">
						<view class="card_text_h1" :data-id="item.teamId" @click="copyTeamId">房间：{{item.teamId}}
							<image class="copyimg" src="@/static/iconimg/copy.png"></image>
						</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">{{item.teamName}}</view>
						<view class="card_text_h2 begin_text"
							:style="item.begin?'background-color: #00CC33;':'background-color: #ff9933;'">
							{{item.begin?"已开始":"准备中"}}
						</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">地图：{{item.mapName}}</view>
					</view>
					<view class="card_text_row_box">
						<view class="card_text_h2">模式：{{item.modeName}}</view>
						<view class="countdown">
							<uni-countdown font-size="12" color="#FFFFFF" splitorColor="#FFFFFF" :show-day="false"
								:hour="item.hour" :minute="item.minute" :second="item.second" :data-id="item._id"
								@timeup="timeup" />
							<view>后解散</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 没有数据 -->
		<view v-if="myteamNav && Myteamlist.length ==''" class="teamnull">
			<image src="@/static/iconimg/nodata.png"></image>
			<view>暂无数据</view>
		</view>

		<!-- 按钮 -->
		<view class="botNavBox">
			<view v-if="myteamNav && Myteamlist.length ==''" class="cjteam color_gold" @click="goCreateTeam">创建队伍</view>
			<view v-if="myteamNav" class="mePage color_gold" @click="goMePage">个人中心</view>
		</view>
		<!-- 底部填充盒子 -->
		<view class="bottom_fill_box"></view>

	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				UserLogin: false, //检测是否登录函数，未登录则提示登录
				age: '18',
				type: 'teamhall',
				teamhallNav: true,
				myteamNav: false,
				notice: '欢迎使用鹅鸭杀组队小程序，本程序只发布房间号，不创建任何聊天群，请注意保护个人信息财产安全，请大家素质游戏更快乐',
				page: 0,
				total: 0,
				TeamhallList: [],
				Myteamlist: [],
				interval: '',
			}
		},
		/** 
		 * 生命周期函数--监听页面加载
		 */
		onLoad() {
			console.log("首页onLoad")
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			console.log("首页onShow")
			this.getUserInfo()
			this.getSysNotice()
			let type = this.type
			let page = this.page
			console.log("默认的导航栏：", type)
			if (type == 'teamhall') {
				this.TeamhallList = []
				this.getTeamhall(page)
			}
			if (type == 'myteam') {
				this.Myteamlist = []
				this.getMyteam()
			}
		},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			console.log("首页onHide")
			// clearInterval(this.interval) //清除计时器
			// this.interval = ''
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			console.log("首页onUnload")
			// clearInterval(this.interval) //清除计时器
			// this.interval = ''
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh() {
			uni.showNavigationBarLoading() //在标题栏中显示加载
			let type = this.type
			console.log("下拉当前的导航栏：", type)
			if (type == 'teamhall') {
				this.TeamhallList = []
				this.getTeamhall(this.page)
			}
			if (type == 'myteam') {
				this.Myteamlist = []
				this.getMyteam()
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			let type = this.type
			if (type == 'teamhall') {
				let total = this.total
				let TeamhallList = this.TeamhallList
				if (TeamhallList.length < total) {
					let page = TeamhallList.length
					this.getTeamhall(page)
				} else {
					uni.showToast({
						icon: "none",
						title: '没有数据了哟',
						duration: 1000,
					})
				}
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		//分享给朋友
		onShareAppMessage: function() {
			return {
				title: '鹅鸭杀组队小程序.组队大厅',
			}

		},
		//分享朋友圈
		onShareTimeline: function() {
			return {
				title: '鹅鸭杀组队小程序.组队大厅',
				// query: this.TeamList[0],
			}
		},

		methods: {
			// 获取用户信息
			getUserInfo() {
				let UserInfo = uni.getStorageSync('UserInfo')
				console.log("缓存里的用户信息：", UserInfo)
				if (UserInfo != "") {
					this.age = UserInfo.age
					this.UserLogin = true
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '为了更好的匹配队友，先去完善一些信息吧',
						success: res => {
							if (res.confirm) {
								console.log('用户点击确定')
								uni.navigateTo({
									url: '/pages/me/me',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
								this.age = '18'
							}
						}
					})
				}
			},

			// 获取系统通知内容
			getSysNotice() {
				db.collection("SysNotice")
					.get()
					.then(res => {
						console.log("获取系统通知内容成功：", res.result.data)
						if (res.result.data[0].notice != '') {
							this.notice = res.result.data[0].notice
						}
					}).catch(err => {
						console.log("获取系统通知内容失败：", err)
					})
			},

			// 切换导航栏
			ChangeTab(e) {
				// console.log("点击了切换导航栏：", e)
				let type = e.currentTarget.dataset.type
				if (type == 'teamhall') {
					//恢复初始值
					this.TeamhallList = []
					this.teamhallNav = true
					this.myteamNav = false
					this.type = 'teamhall'
					this.getTeamhall(this.page)
				}
				if (type == 'myteam') {
					//恢复初始值
					this.Myteamlist = []
					this.teamhallNav = false
					this.myteamNav = true
					this.type = 'myteam'
					this.getMyteam()
				}
			},

			// 查询数据总数
			DocTeamhallCount() {
				db.collection('TeamHall').where({
						'valid': true
					})
					.count()
					.then(res => {
						console.log("查询大厅总条数成功：", res)
						this.total = res.result.total
					}).catch(err => {
						console.log("查询大厅总条数失败：", err)
					})
			},
			// 获取组队大厅
			getTeamhall(page) {
				uni.showLoading({
					title: '加载中...',
				})
				clearInterval(this.interval) //清除计时器，防止加速
				this.interval = ''
				this.TeamhallList = []
				let age = this.age
				db.collection("TeamHall").where({
						'age': age,
						'valid': true
					})
					.orderBy('publishTime', 'desc')
					.skip(page) //从指定条数后开始拉取之后的数据
					.limit(10) //一次拉取多少条数据
					.get()
					.then(res => {
						uni.hideLoading()
						uni.stopPullDownRefresh() //停止下拉
						uni.hideNavigationBarLoading() //隐藏标题栏加载
						console.log("获取组队大厅数据成功：", res.result.data)
						this.TeamhallList = res.result.data
						this.updTime(res.result.data) //定时更新数据库时间
					}).catch(err => {
						uni.hideLoading()
						uni.stopPullDownRefresh() //停止下拉
						uni.hideNavigationBarLoading() //隐藏标题栏加载
						console.log("获取组队大厅数据失败：", err)
					})
			},

			// 获取我的队伍
			getMyteam() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let openId = uni.getStorageSync('openid');
				console.log("用户openid：", openId)
				db.collection("TeamHall").where({
						'openid': openId,
						'valid': true
					}).get()
					.then(res => {
						uni.hideLoading()
						uni.stopPullDownRefresh() //停止下拉
						uni.hideNavigationBarLoading() //隐藏标题栏加载
						console.log("获取我的组队数据成功：", res.result.data)
						this.Myteamlist = res.result.data
					}).catch(err => {
						uni.hideLoading()
						uni.stopPullDownRefresh() //停止下拉
						uni.hideNavigationBarLoading() //隐藏标题栏加载
						console.log("获取我的组队数据失败：", err)
					})
			},

			// 复制房间号
			copyTeamId(e) {
				uni.setClipboardData({
					data: e.currentTarget.dataset.id,
				})
			},
			// 跳转我的队伍详情	
			goTeamDetail(e) {
				console.log("跳转大厅队伍详情:", e)
				let url = '/pages/teamDetail/teamDetail'
				let id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: `${url}?id=${id}`,
				})
			},
			// 跳转我的队伍详情
			goMyTeamDetail(e) {
				console.log("跳转我的队伍详情:", e)
				let url = '/pages/myTeamDetail/myTeamDetail'
				let id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: `${url}?id=${id}`,
				})
			},

			// 跳转创建队伍
			goCreateTeam() {
				console.log("跳转创建队伍", this.UserLogin)
				if (this.UserLogin == true) {
					uni.navigateTo({
						url: '/pages/createTeam/createTeam',
					})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '请先完善一些信息再去创建队伍吧',
						success: res => {
							if (res.confirm) {
								console.log('用户点击确定')
								uni.navigateTo({
									url: '/pages/me/me',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
								this.age = '18'
							}
						}
					})
				}

			},

			// 跳转个人中心
			goMePage() {
				uni.navigateTo({
					url: '/pages/me/me'
				})
			},

			// 定时更新时间
			updTime(e) {
				console.log("定时更新方法：", e)
				this.interval = setInterval(() => {
					this.getTeamhall(this.page)
					e.forEach((item) => {
						console.log("id：", item._id, "时间：", item.minute)
						for (let i = 0; i < e.length; i++) {
							if (item.minute == 0) {
								db.collection('TeamHall').doc(item._id).remove({})
									.then(res => {
										uni.hideLoading()
										console.log("时间到解散队伍成功", res)
									}).catch(err => {
										uni.hideLoading()
										console.log("时间到解散队伍失败", err)
									})
							} else {
								db.collection("TeamHall").doc(item._id).update({
									minute: item.minute - 1
								}).then(res => {
									console.log("更新时间成功：", res)

								}).catch(err => {
									console.log("更新时间失败：", err)
								})
							}
						}
					});
				}, 60000)
			},

			// 倒计时到
			timeup() {
				console.log("时间到：", )
			},
		},
	}
</script>

<style>
	/* 顶部导航栏 */
	.topnav {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: start;
		font-size: 20px;
		font-weight: 600;
		background-color: #403873;
	}

	.navitem {
		margin-left: 30upx;
	}

	.nav_color {
		padding: 10rpx;
		border-bottom: 2px #42A5F5 solid;
	}

	/* 滚动通知栏 */
	.notice {
		margin-top: 100rpx;
	}

	/* 复制图标 */
	.copyimg {
		width: 40rpx;
		height: 40rpx;
	}

	/* 倒计时 */
	.countdown {
		display: flex;
		flex-direction: row;
		font-size: 12px;
	}

	/* 没有数据 */
	.teamnull {
		margin: 10px;
		text-align: center;
	}

	.teamnull image {
		width: 80px;
		height: 50px;
	}

	/* 底部导航栏 */
	.botNavBox {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 30rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	/* 创建队伍 */
	.cjteam {
		width: 300rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 26px;
		text-align: center;
		border-radius: 10px;
		border-top: rgb(154, 86, 233) solid 6rpx;
		border-left: rgb(154, 86, 233) solid 6rpx;
		background-color: #590d8f;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.mePage {
		width: 200rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 18px;
		text-align: center;
		border-radius: 10px;
		border-top: rgb(154, 86, 233) solid 6rpx;
		border-left: rgb(154, 86, 233) solid 6rpx;
		background-color: #590d8f;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}
</style>
