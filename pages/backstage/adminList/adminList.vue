<template>
	<view>
		<!-- 添加按钮 -->
		<view class="addAdmin">
			<image src="../../static/iconimg/add.png" @click="addAdmin"></image>
		</view>

		<!-- 管理员列表 -->
		<view class="logged_box" v-for="(item,index) in adminList" :key="item._id">
			<view class="head_img">
				<image :src="item.headImg"></image>
			</view>
			<view class="user_info">
				<view class="nickname">{{index +1}}、昵称：{{item.name}} </view>
				<view class="user_type ">等级：<text class="level"
						:class="item.level == '2'?'color_2':'color_1'">({{item.level =='2'?'超级管理员':'普通管理员'}})</text>
				</view>
				<view class="user_type ">说明：<text class="level"
						:class="item.level == '2'?'color_2':'color_1'">({{item.level =='2'?'超级管理员进入小程序端后台系统有全部功能使用权限，请谨慎操作！':'普通管理员进入小程序端后台系统有使用“审核”功能权限，请谨慎操作！'}})</text>
				</view>
				<view class="user_type ">添加人：{{item.operator}}</view>
				<view class="user_type ">添加时间：{{item.addAdminTime}}</view>
				<view>移除管理员：
					<switch :data-id="item._id" :data-level="item.level" :checked="switchAdmin"
						@change="switchChange" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				switchAdmin: true,
				adminList: [],
				page: 0,
				total: 0,
				level: 0,
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			this.page = 0
			this.total = 0
			this.adminList = []
			this.getAdmin(this.page)
			this.DocCount()
			this.getUserInfo()
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			let total = this.total
			let adminList = this.adminList
			if (adminList.length < total) {
				let page = adminList.length
				this.getAdmin(page)
			} else {
				uni.showToast({
					icon: "none",
					title: '没有数据了哟',
					duration: 1000,
				})
			}
		},
		methods: {
			// 查询数据总数
			DocCount() {
				db.collection('DuckUsers').where({
						'admin': true,
					})
					.count()
					.then(res => {
						console.log("查询总条数成功：", res)
						this.total = res.result.total
					}).catch(err => {
						console.log("查询总条数失败：", err)
					})
			},

			// 查询所有管理员
			getAdmin(page) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let ListArr = this.adminList
				db.collection('DuckUsers').where({
						'admin': true
					})
					.orderBy('level', 'desc')
					.skip(page)
					.limit(10)
					.get()
					.then(res => {
						uni.hideLoading()
						console.log("查询所有管理员成功：", res)
						let data = res.result.data
						if (data.length > 0) {
							for (let i = 0; i < data.length; i++) {
								ListArr.push(data[i])
							}
							this.adminList = ListArr
						}
					}).catch(err => {
						uni.hideLoading()
						console.log("查询所有管理员失败：", err)
					})
			},

			// 获取用户信息
			getUserInfo() {
				let openId = uni.getStorageSync('openid');
				console.log("用户openid：", openId)
				db.collection("DuckUsers").where({
						"openid": openId,
					}).get()
					.then(res => {
						console.log("用openid查询用户成功：", res.result.data)
						let data = res.result.data[0]
						this.level = data.level
					}).catch(err => {
						console.log("用openid查询用户失败：", err)
					})
			},

			// 跳转添加新管理员页面
			addAdmin() {
				if (this.level === 2) {
					uni.navigateTo({
						url: '../addAdmin/addAdmin',
					})
				} else {
					uni.showToast({
						title: '没有权限！',
						icon: 'none',
						duration: 1000
					})
				}
			},

			// 关闭管理员
			switchChange(e) {
				console.log('关闭管理员：', e)
				if (this.level === 2) {
					let itemid = e.currentTarget.dataset.id
					let itemlevel = e.currentTarget.dataset.level
					let value = e.detail.value
					if (value == false && itemlevel != 2) {
						uni.showLoading({
							title: '加载中...',
							mask: true
						})
						db.collection('DuckUsers').doc(itemid).update({
								admin: false,
								level: Number("0"),
							})
							.then(res => {
								uni.hideLoading()
								console.log("移除成功：", res.result.updated)
								if (res.result.updated > 0) {
									// 刷新数据
									this.page = 0
									this.total = 0
									this.adminList = []
									this.getAdmin(this.page)
									this.DocCount()
								}
							}).catch(err => {
								uni.hideLoading()
								console.log("移除失败：", err)
								this.switchAdmin = true
							})
					} else {
						uni.showToast({
							title: '超级管理员不能移除！请在PC端移除',
							icon: 'none',
							duration: 1000
						})
						this.switchAdmin = true
					}
				} else {
					this.switchAdmin = true
					uni.showToast({
						title: '没有权限！',
						icon: 'none',
						duration: 1000
					})
				}
			}
		}
	}
</script>

<style>
	/* 添加按钮 */
	.addAdmin {
		position: fixed;
		bottom: 30rpx;
		right: 20rpx;
	}

	.addAdmin image {
		width: 100rpx;
		height: 100rpx;
	}

	/* 管理员列表 */

	.logged_box {
		height: auto;
		margin: 20rpx;
		padding: 10rpx;
		border-radius: 16rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		background-color: #fff;
		box-shadow: 20rpx 20rpx 10rpx rgba(39, 48, 57, 0.5);
	}

	.head_img {
		width: 25%;
		height: auto;
	}

	.head_img image {
		margin: 10rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.user_info {
		width: 75%;
	}

	.nickname {
		margin: 10rpx;
		font-weight: bold;
		font-size: 13px;
		text-align: start;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.user_type {
		margin: 10rpx;
		font-size: 10px;
		text-align: start;
		color: grey;
	}

	.level {
		font-size: 10px;
	}

	.color_1 {
		color: skyblue;
	}

	.color_2 {
		color: red;
	}

	.text_red {
		color: red;
	}
</style>
