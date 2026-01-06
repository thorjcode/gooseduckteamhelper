<template>
	<view>
		<!-- 普通用户列表 -->
		<view class="logged_box" v-for="(item,index) in UserList" :key="item._id">
			<view class="head_img">
				<image :src="item.headImg"></image>
			</view>
			<view class="user_info">
				<view class="nickname">{{index +1}}、昵称：{{item.name}}</view>
				<view class="user_type">注册时间：{{item.registerTime}}</view>
				<view class="user_type text_red">说明：此次添加为普通管理员身份，请谨慎添加！</view>
				<view>添加管理员：
					<switch :data-id="item._id" :checked="switch" @change="addAdmin" />
				</view>
			</view>
		</view>

		<view class="nohting" v-if="total == ''">
			<view>暂时没有可添加的用户！</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const formatTime = date => {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const hour = date.getHours()
		const minute = date.getMinutes()

		return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute].map(formatNumber).join(':')}`
	}

	const formatNumber = n => {
		n = n.toString()
		return n[1] ? n : `0${n}`
	}
	export default {
		data() {
			return {
				UserList: [],
				switch: false,
				total: 0,
				page: 0,
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			this.page = 0
			this.total = 0
			this.UserList = []
			this.getUser(this.page)
			this.DocCount()
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			let total = this.total
			let UserList = this.UserList
			if (UserList.length < total) {
				let page = UserList.length
				this.getUser(page)
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
						'admin': false,
					})
					.count()
					.then(res => {
						console.log("查询总条数成功：", res)
						this.total = res.result.total
					}).catch(err => {
						console.log("查询总条数失败：", err)
					})
			},

			// 查询普通用户
			getUser(page) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let ListArr = this.UserList
				db.collection('DuckUsers').where({
						'admin': false
					})
					.skip(page)
					.limit(10)
					.orderBy('registerTime', 'desc')
					.get()
					.then(res => {
						uni.hideLoading()
						console.log("查询所有普通用户成功：", res)
						let data = res.result.data
						if (data.length > 0) {
							for (let i = 0; i < data.length; i++) {
								ListArr.push(data[i])
							}
							this.UserList = ListArr
						}
					}).catch(err => {
						uni.hideLoading()
						console.log("查询所有普通用户失败：", err)
					})
			},


			// 添加管理员
			addAdmin(e) {
				console.log('点击了添加管理员', e)
				let userInfo = uni.getStorageSync('UserInfo')
				let id = e.currentTarget.dataset.id
				let value = e.detail.value
				if (value) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
					db.collection("DuckUsers").doc(id).update({
						admin: true,
						level: Number("1"),
						operator: userInfo.name,
						addAdminTime: formatTime(new Date())
					}).then(res => {
						uni.hideLoading()
						console.log("添加成功", res)
						uni.showToast({
							title: '添加成功',
							icon: 'success',
							duration: 1000,
						})
						uni.navigateBack({
							delta: 1,
						})
					}).catch(err => {
						uni.hideLoading()
						console.log("添加失败", err)
						uni.showToast({
							title: '网络错误，添加失败',
							icon: 'error',
							duration: 1000,
						})
					})
				}
			},
		}
	}
</script>

<style>
	/* 普通用户列表 */
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

	.text_red {
		color: red;
	}

	.nohting {
		height: 50rpx;
		line-height: 50rpx;
		margin: 20rpx;
		padding: 10rpx;
		font-size: 10px;
		color: red;
		text-align: center;
		border-radius: 16rpx;
		background-color: #fff;
		box-shadow: 20rpx 20rpx 10rpx rgba(39, 48, 57, 0.05);
	}
</style>
