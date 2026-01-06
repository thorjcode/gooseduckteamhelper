<template>
	<view class="main_page color_white">
		<!-- 房间号 -->
		<view class="teamId">
			<view class="title">房间号</view>
			<input placeholder="填写房间号" placeholder-class="placeholder" @input="inputTeamId" />
		</view>
		<!-- 队伍名 -->
		<view class="teamName">
			<view class="title">队伍名</view>
			<input placeholder="填写队伍名" :value="teamName" placeholder-class="placeholder" @input="inputTeamName" />
		</view>
		<!-- 队伍类型 -->
		<view class="teamType">
			<view class="title">队伍类型</view>
			<!-- 栏目列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" :class="typeid == item._id?'item_ckd':''" v-for="item in SysTeamType"
					:key="item._id">
					<view class="sudoku_item_name" :data-itemid="item._id" :data-type="item.teamType"
						@click="clickTeamType">{{item.teamType}}</view>
				</view>
			</view>
		</view>
		<!-- 游戏模式 -->
		<view class="gameMode">
			<view class="title">游戏模式</view>
			<!-- 栏目列表 -->
			<view class="sudoku_list">

				<view class="sudoku_item" :class="modeid == item._id?'item_ckd':''" v-for="item in SysGameMode"
					:key="item._id">
					<image class="sudoku_item_img" :src="item.modeImg" :data-itemid="item._id"
						:data-name="item.modeName" :data-img="item.modeImg" @click="clickGameMode"></image>
					<view class="sudoku_item_name">{{item.modeName}}</view>
				</view>
			</view>
		</view>
		<!-- 游戏地图 -->
		<view class="gameMap">
			<view class="title">游戏地图</view>
			<!-- 栏目列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" :class="mapid == item._id?'item_ckd':''" v-for="item in SysGameMap"
					:key="item._id">
					<image class="sudoku_item_img" :src="item.mapImg" :data-itemid="item._id" :data-name="item.mapName"
						:data-img="item.mapImg" @click="clickGameMap"></image>
					<view class="sudoku_item_name">{{item.mapName}}</view>
				</view>
			</view>
		</view>
		<!-- 确定按钮 -->
		<view style="margin-top: 30rpx;">
			<view class="cfmbtn color_gold" @click="SubmitBtn">确定创建</view>
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
				openId: '',
				SysTeamType: [],
				SysGameMode: [],
				SysGameMap: [],
				headImg: '',
				teamId: '',
				teamName: '',
				typeid: '',
				teamType: '',
				modeid: '',
				modeName: '',
				modeImg: '',
				mapid: '',
				mapName: '',
				mapImg: '',
				age: '18'
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad() {
			console.log("创建队伍onLoad")
			this.openId = uni.getStorageSync('openid')
			this.getUserInfo()
			this.getSysTeamType()
			this.getSysGameMode()
			this.getGameMap()
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				let UserInfo = uni.getStorageSync('UserInfo')
				console.log("缓存里的用户信息：", UserInfo)
				if (UserInfo != "") {
					this.age = UserInfo.age
					this.teamName = UserInfo.name + '的队伍'
					this.headImg = UserInfo.headImg
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

			// 获取系统队伍类型信息
			getSysTeamType() {
				db.collection('SysTeamType')
					.get()
					.then(res => {
						console.log("查询队伍类型成功：", res.result.data)
						this.SysTeamType = res.result.data
					}).catch(err => {
						console.log("查询队伍类型失败：", err)
					})
			},

			// 获取系统游戏模式信息
			getSysGameMode() {
				db.collection('SysGameMode')
					.get()
					.then(res => {
						console.log("查询游戏模式成功：", res.result.data)
						this.SysGameMode = res.result.data
					}).catch(err => {
						console.log("查询游戏模式失败：", err)
					})
			},

			// 获取系统游戏地图信息
			getGameMap() {
				db.collection('SysGameMap')
					.get()
					.then(res => {
						console.log("查询游戏地图成功：", res.result.data)
						this.SysGameMap = res.result.data
					}).catch(err => {
						console.log("查询游戏地图失败：", err)
					})
			},

			// 填写房间号
			inputTeamId(e) {
				console.log('获取输入房间号成功', e.detail.value)
				this.teamId = e.detail.value

			},
			// 填写队伍名
			inputTeamName(e) {
				console.log('获取输入队伍名成功', e.detail.value)
				this.teamName = e.detail.value

			},

			// 点击队伍类型
			clickTeamType(e) {
				let itemid = e.currentTarget.dataset.itemid
				let teamType = e.currentTarget.dataset.type
				console.log('点击队伍类型：', itemid, e)
				if (this.typeid == itemid) {
					this.typeid = ''
					this.teamType = ''

				} else {
					this.typeid = itemid
					this.teamType = teamType
				}
			},

			// 点击游戏模式
			clickGameMode(e) {
				let itemid = e.currentTarget.dataset.itemid
				let modeName = e.currentTarget.dataset.name
				let modeImg = e.currentTarget.dataset.img
				console.log('点击游戏模式：', itemid, e)
				if (this.modeid == itemid) {
					this.modeid = ''
					this.modeName = ''
					this.modeImg = ''
				} else {
					this.modeid = itemid
					this.modeName = modeName
					this.modeImg = modeImg
				}
			},
			// 点击游戏地图
			clickGameMap(e) {
				let itemid = e.currentTarget.dataset.itemid
				let mapName = e.currentTarget.dataset.name
				let mapImg = e.currentTarget.dataset.img
				console.log('点击游戏地图：', itemid, e)
				if (this.mapid == itemid) {
					this.mapid = ''
					this.mapName = ''
					this.mapImg = ''
				} else {
					this.mapid = itemid
					this.mapName = mapName
					this.mapImg = mapImg
				}
			},

			/**
			 * 确认提交按钮
			 */
			SubmitBtn(e) {
				let teamId = this.teamId
				let teamName = this.teamName
				let teamType = this.teamType
				let modeName = this.modeName
				let mapName = this.mapName
				console.log('确认提交按钮里的位置信息：', teamId, teamName, teamType, modeName, mapName)
				if (teamId == "") {
					uni.showToast({
						title: '请填写房间号！',
						icon: 'none',
						duration: 1000,
					})

				} else if (teamName == "") {
					uni.showToast({
						title: '请填写队伍名！',
						duration: 1000,
						icon: "none"
					})
				} else if (teamType == "") {
					uni.showToast({
						title: '请选择队伍类型！',
						duration: 1000,
						icon: "none"
					})
				} else if (modeName == "") {
					uni.showToast({
						title: '请选择游戏模式！',
						duration: 1000,
						icon: "none"
					})
				} else if (mapName == "") {
					uni.showToast({
						title: '请选择游戏地图！',
						duration: 1000,
						icon: "none"
					})
				} else {
					this.SubmitData()
				}
			},

			// 提交数据
			SubmitData() {
				let openId = this.openId
				let teamId = this.teamId
				let headImg = this.headImg
				let teamName = this.teamName
				let teamType = this.teamType
				let modeName = this.modeName
				let modeImg = this.modeImg
				let mapName = this.mapName
				let mapImg = this.mapImg
				let age = this.age
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				db.collection('TeamHall')
					.add({
						openid: openId,
						teamId,
						captainHeahImg: headImg,
						teamName,
						teamType,
						modeName,
						modeImg,
						mapName,
						mapImg,
						age,
						minute: 15,
						begin: false,
						valid: true,
						publishTime: new Date()
					}).then(res => {
						uni.hideLoading()
						console.log('写入成功', res.errMsg, res)
						//返回
						uni.navigateBack({
							delta: 1
						})
					}).catch(err => {
						uni.hideLoading()
						console.log('写入失败', err)
						uni.showToast({
							title: '录入失败，请检查网络后重试！',
							icon: 'none',
							mask: true,
							duration: 1000,
						})
					})
			},

		}
	}
</script>

<style>
	/* 房间号 */

	/* 队伍名 */

	/* 队伍类型 */

	/* 标题 */
	.title {
		margin: 20rpx;
	}

	/* 输入框 */
	input {
		padding: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		border: white solid 2rpx;
		border-radius: 16rpx;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	/* 输入框提示 */
	.placeholder {
		margin-left: 20rpx;
		color: white;
	}

	/* 栏目列表 */
	.sudoku_list {
		padding: 10rpx;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		border-radius: 16rpx;
		backdrop-filter: blur(10px);
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.item_ckd {
		padding: 4rpx;
		border-radius: 30rpx;
		background-color: rgba(10, 223, 10, 0.4);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.sudoku_item {
		width: 130rpx;
		margin: 4rpx;
		padding: 4rpx;
	}

	.sudoku_item_name {
		margin: 5rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.sudoku_item_img {
		margin-top: 15rpx;
		margin-left: 15rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		overflow: hidden;
		box-shadow: 4px 4px 8px rgba(99, 95, 95, 0.6);
	}

	/* 确定创建按钮 */
	.cfmbtn {
		margin: 0 auto;
		width: 250rpx;
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
