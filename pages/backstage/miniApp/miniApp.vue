<template>
	<view>
		<!-- 队伍类型 -->
		<view class="store_info_box">
			<view class="add_box">
				<view>队伍类型</view>
				<image src="../../static/iconimg/add.png" data-url="../addTeamType/addTeamType" @click="Navigate">
				</image>
			</view>
			<!-- 列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" v-for="item in TeamTypeList" :key="item._id" :data-id="item._id"
					:data-name="item.teamType" @longpress="longPressTeamType">
					<view class="sudoku_item_name">{{item.teamType}}</view>
				</view>
			</view>
			<!-- 提示 -->
			<text class="text_tips_spring">【提示】：长按删除</text>
		</view>

		<!-- 添加游戏模式 -->
		<view class="store_info_box">
			<view class="add_box">
				<view>游戏模式</view>
				<image src="../../static/iconimg/add.png" data-url="../addGameMode/addGameMode" @click="Navigate">
				</image>
			</view>
			<!-- 列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" v-for="item in GameModeList" :key="item._id" :data-id="item._id"
					:data-name="item.modeName" :data-img="item.modeImg" @longpress="longPressGameMode">
					<image class="sudoku_item_img" :src="item.modeImg"></image>
					<view class="sudoku_item_name">{{item.modeName}}</view>
				</view>
			</view>
			<!-- 提示 -->
			<view class="text_tips_spring">【提示】：长按删除</view>
		</view>

		<!-- 添加游戏地图 -->
		<view class="store_info_box">
			<view class="add_box">
				<view>游戏地图</view>
				<image src="../../static/iconimg/add.png" data-url="../addGameMap/addGameMap" @click="Navigate"></image>
			</view>
			<!-- 列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" v-for="item in GameMapList" :key="item._id" :data-id="item._id"
					:data-name="item.mapName" :data-img="item.mapImg" @longpress="longPressGameMap">
					<image class="sudoku_item_img" :src="item.mapImg"></image>
					<view class="sudoku_item_name">{{item.mapName}}</view>
				</view>
			</view>
			<!-- 提示 -->
			<view class="text_tips_spring">【提示】：长按删除</view>
		</view>

		<!-- 添加头像 -->
		<view class="store_info_box">
			<view class="add_box">
				<view>添加头像</view>
				<image src="../../static/iconimg/add.png" data-url="../addHeadImg/addHeadImg" @click="Navigate"></image>
			</view>
			<!-- 列表 -->
			<view class="sudoku_list">
				<view class="sudoku_item" v-for="item in SysHeadImgList" :key="item._id" :data-id="item._id"
					:data-name="item.headName" :data-img="item.sysHeadImg" @longpress="longPressHeadImg">
					<image class="sudoku_item_img" :src="item.sysHeadImg"></image>
					<view class="sudoku_item_name">{{item.headName}}</view>
				</view>
			</view>
			<!-- 提示 -->
			<view class="text_tips_spring">【提示】：长按删除</view>
		</view>

		<!-- 添加我的页面背景图-->
		<view class="store_info_box">
			<view class="add_box">
				<view>我的页面背景</view>
				<image src="../../static/iconimg/add.png" data-url="../addMeTopBg/addMeTopBg" @click="Navigate"></image>
			</view>
			<!-- 列表 -->
			<view class="sudoku_list" v-for="item in MeTopBgList" :key="item._id">
				<image :src="item.meTopImg" @click="addMeTopBg"></image>
			</view>
			<!-- 提示 -->
			<view class="text_tips_spring">【提示】：点击图片进行编辑</view>
		</view>

		<!-- 滚动通知 -->
		<view class="store_info_box">
			<view class="add_box">
				<view>滚动通知</view>
				<image src="../../static/iconimg/add.png" data-url="../addNotice/addNotice" @click="Navigate">
				</image>
			</view>
			<!-- 列表 -->
			<view>{{notice}}</view>
			<view>编辑者：{{editer}}</view>
			<!-- 提示 -->
			<text class="text_tips_spring">【提示】：点击加号编辑</text>
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
				TeamTypeList: [],
				GameModeList: [],
				GameMapList: [],
				SysHeadImgList: [],
				MeTopBgList: [],
				notice: '',
				editer: '暂无'
			}
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
			this.getSysNotice()
			this.getSysTeamType()
			this.getSysGameMode()
			this.getSysGameMap()
			this.getSysHeadimg()
			this.getSysMeTopImg()
		},
		methods: {
			// 获取系统通知内容
			getSysNotice() {
				db.collection("SysNotice")
					.get()
					.then(res => {
						console.log("获取系统通知内容成功：", res.result.data)
						this.notice = res.result.data[0].notice
						this.editer = res.result.data[0].editer
					}).catch(err => {
						console.log("获取系统通知内容失败：", err)
					})
			},
			// 获取系统队伍类型信息
			getSysTeamType() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				db.collection('SysTeamType')
					.get()
					.then(res => {
						uni.hideLoading()
						console.log("查询队伍类型成功：", res.result.data)
						this.TeamTypeList = res.result.data
					}).catch(err => {
						uni.hideLoading()
						console.log("查询队伍类型失败：", err)
					})
			},

			// 获取系统游戏模式信息
			getSysGameMode() {
				db.collection('SysGameMode')
					.get()
					.then(res => {
						console.log("查询游戏模式成功：", res.result.data)
						this.GameModeList = res.result.data
					}).catch(err => {
						console.log("查询游戏模式失败：", err)
					})
			},

			// 获取系统游戏地图信息
			getSysGameMap() {
				db.collection('SysGameMap')
					.get()
					.then(res => {
						console.log("查询游戏地图成功：", res.result.data)
						this.GameMapList = res.result.data
					}).catch(err => {
						console.log("查询游戏地图失败：", err)
					})
			},

			// 获取系统头像图片
			getSysHeadimg() {
				db.collection("SysHeadImg").get()
					.then(res => {
						console.log("获取系统头像数据成功：", res.result.data)
						this.SysHeadImgList = res.result.data
					}).catch(err => {
						console.log("获取系统头像数据失败：", err)
					})
			},

			// 获取系统顶部背景图片
			getSysMeTopImg() {
				db.collection("SysMeTopImg").get()
					.then(res => {
						console.log("获取系统顶部背景图片成功：", res.result.data)
						this.MeTopBgList = res.result.data

					}).catch(err => {
						console.log("获取系统顶部背景图片失败：", err)
					})
			},

			// 跳转函数
			Navigate(e) {
				let url = e.currentTarget.dataset.url
				wx.navigateTo({
					url: `${url}`,
				})
			},

			// 长按队伍类型
			longPressTeamType(e) {
				let id = e.currentTarget.dataset.id.trim()
				console.log('长按获取的id：', id)
				let name = e.currentTarget.dataset.name
				console.log('长按获取的name：', name)
				uni.showModal({
					title: '温馨提醒',
					content: `确定删除 ${name} ? 删除后将不可恢复！`,
					confirmText: '删除',
					confirmColor: '#ff0080',
					cancelText: '取消',
					mask: true,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中...',
								mask: true
							})
							db.collection('SysTeamType').doc(id).remove({})
								.then(res => {
									uni.hideLoading()
									console.log("删除成功", res)
									uni.showToast({
										title: '删除成功',
										icon: 'success',
										duration: 1000,
									})
									// 刷新数据
									this.getSysTeamType()
								}).catch(err => {
									uni.hideLoading()
									console.log("删除失败", err)
									uni.showToast({
										title: '网络错误，操作失败！',
										icon: 'error',
										duration: 1000,
									})
								})
						}
					}
				})
			},

			// 长按游戏模式
			longPressGameMode(e) {
				let id = e.currentTarget.dataset.id.trim()
				console.log('长按获取的id：', id)
				let name = e.currentTarget.dataset.name
				console.log('长按获取的name：', name)
				let img = e.currentTarget.dataset.img
				console.log('长按获取的img', img, typeof img)
				uni.showModal({
					title: '温馨提醒',
					content: `确定删除 ${name} ? 删除后将不可恢复！`,
					confirmText: '删除',
					confirmColor: '#ff0080',
					cancelText: '取消',
					mask: true,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中...',
								mask: true
							})
							let imgArr = []
							imgArr.push(img)
							console.log('要删除的img', imgArr, typeof imgArr)
							uniCloud.callFunction({
								name: "deleteImgFile",
								data: {
									imgArr
								}
							}).then(res => {
								console.log('删除云存储文件成功：', res)
								db.collection('SysGameMode').doc(id).remove({})
									.then(res => {
										uni.hideLoading()
										console.log("删除成功", res)
										uni.showToast({
											title: '删除成功',
											icon: 'success',
											duration: 1000,
										})
										// 刷新数据
										this.getSysGameMode()

									}).catch(err => {
										uni.hideLoading()
										console.log("删除失败", err)
										uni.showToast({
											title: '网络错误，删除失败！',
											icon: 'error',
											duration: 1000,
										})
									})
							}).catch(err => {
								console.log('删除云存储文件失败：', err)
								uni.hideLoading()
							})

						}
					}
				})
			},

			// 长按游戏地图
			longPressGameMap(e) {
				let id = e.currentTarget.dataset.id.trim()
				console.log('长按获取的id：', id)
				let name = e.currentTarget.dataset.name
				console.log('长按获取的name：', name)
				let img = e.currentTarget.dataset.img
				console.log('长按获取的img', img, typeof img)
				uni.showModal({
					title: '温馨提醒',
					content: `确定删除 ${name} ? 删除后将不可恢复！`,
					confirmText: '删除',
					confirmColor: '#ff0080',
					cancelText: '取消',
					mask: true,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中...',
								mask: true
							})
							let imgArr = []
							imgArr.push(img)
							console.log('要删除的img', imgArr, typeof imgArr)
							uniCloud.callFunction({
								name: "deleteImgFile",
								data: {
									imgArr
								}
							}).then(res => {
								console.log('删除云存储文件成功：', res)
								db.collection('SysGameMap').doc(id).remove({})
									.then(res => {
										uni.hideLoading()
										console.log("删除成功", res)
										uni.showToast({
											title: '删除成功',
											icon: 'success',
											duration: 1000,
										})
										// 刷新数据
										this.getSysGameMap()

									}).catch(err => {
										uni.hideLoading()
										console.log("删除失败", err)
										uni.showToast({
											title: '网络错误，删除失败！',
											icon: 'error',
											duration: 1000,
										})
									})
							}).catch(err => {
								console.log('删除云存储文件失败：', err)
								uni.hideLoading()
							})

						}
					}
				})
			},
			// 长按系统头像
			longPressHeadImg(e) {
				let id = e.currentTarget.dataset.id.trim()
				console.log('长按获取的id：', id)
				let name = e.currentTarget.dataset.name
				console.log('长按获取的name：', name)
				let img = e.currentTarget.dataset.img
				console.log('长按获取的img', img, typeof img)
				uni.showModal({
					title: '温馨提醒',
					content: `确定删除 ${name} ? 删除后将不可恢复！`,
					confirmText: '删除',
					confirmColor: '#ff0080',
					cancelText: '取消',
					mask: true,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中...',
								mask: true
							})
							let imgArr = []
							imgArr.push(img)
							console.log('要删除的img', imgArr, typeof imgArr)
							uniCloud.callFunction({
								name: "deleteImgFile",
								data: {
									imgArr
								}
							}).then(res => {
								console.log('删除云存储文件成功：', res)
								db.collection('SysHeadImg').doc(id).remove({})
									.then(res => {
										uni.hideLoading()
										console.log("删除成功", res)
										uni.showToast({
											title: '删除成功',
											icon: 'success',
											duration: 1000,
										})
										// 刷新数据
										this.getSysHeadimg()

									}).catch(err => {
										uni.hideLoading()
										console.log("删除失败", err)
										uni.showToast({
											title: '网络错误，删除失败！',
											icon: 'error',
											duration: 1000,
										})
									})
							}).catch(err => {
								console.log('删除云存储文件失败：', err)
								uni.hideLoading()
							})

						}
					}
				})
			},
			// 跳转编辑我的页面背景
			addMeTopBg() {
				wx.navigateTo({
					url: '../addMeTopBg/addMeTopBg',
				})
			},
		}
	}
</script>

<style>
	.add_box {
		margin: 10rpx;
		text-align: center;
	}

	.add_box image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.store_info_box {
		margin: 15rpx;
		padding: 20rpx;
		height: auto;
		border-radius: 15rpx;
		background-color: #fff;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	/* 功能列表 */
	.sudoku_list {
		width: 100%;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		border-radius: 18rpx;
		border-top: white solid 6rpx;
		border-left: white solid 6rpx;
		background: rgba(250, 250, 250, 0.5);
	}

	.sudoku_item {
		width: 20%;
		margin: 10rpx;
		backdrop-filter: blur(10px);
		border-radius: 18rpx;
		text-align: center;
		border-top: white solid 6rpx;
		border-left: white solid 6rpx;
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.sudoku_item_name {
		margin: 10rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.sudoku_item_img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 16px;
		overflow: hidden;
	}
</style>