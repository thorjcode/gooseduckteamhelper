<template>
	<view>
		<view class="box">
			<view class="input_box">
				<text class="input_label">滚动通知：</text>
				<textarea class="input_text" auto-height="true" placeholder="填写通知内容" :value="inputValue" @input="inputData" />
			</view>
			<view class="input_button">
				<view class="bg_blue cancle_btn" @click="closeInput">取消</view>
				<view class="bg_green confirm_btn" @click="confirmSubmit">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				id: '',
				inputValue: '',
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			this.getSysNotice()
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			uni.removeStorageSync('befNotice')
		},
		methods: {
			// 获取系统通知内容
			getSysNotice() {
				db.collection("SysNotice")
					.get()
					.then(res => {
						console.log("获取系统通知内容成功：", res.result.data)
						if (res.result.data.length > 0) {
							this.id = res.result.data[0]._id
							this.inputValue = res.result.data[0].notice
							uni.setStorageSync('befNotice', res.result.data[0].notice)
						}
					}).catch(err => {
						console.log("获取系统通知内容失败：", err)
					})
			},
			/**
			 * 获取输入框数据
			 */
			inputData(e) {
				this.inputValue = e.detail.value
			},

			//取消按钮
			closeInput() {
				uni.navigateBack({
					delta: 1,
				})
			},

			/**
			 * 确认提交按钮
			 */
			confirmSubmit() {
				let inputValue = this.inputValue
				let befNotice = uni.getStorageSync('befNotice')
				if (inputValue == befNotice) {
					uni.showToast({
						title: '请填写新的内容！',
						duration: 1000,
						icon: "none"
					})
				} else {
					this.addData()
				}
			},

			/**
			 * 添加数据
			 */
			addData() {
				let id = this.id
				if (id == '') {
					uni.showLoading({
						title: '添加中...',
						mask: true,
					})
					let userInfo = uni.getStorageSync('UserInfo')
					db.collection('SysNotice')
						.add({
							notice: this.inputValue,
							editer: userInfo.name
						})
						.then(res => {
							uni.hideLoading()
							console.log("添加成功", res)
							uni.showToast({
								title: '添加成功',
								icon: 'success',
								duration: 1000,
							})
							// 刷新数据
							this.getSysNotice()
						})
						.catch(err => {
							uni.hideLoading()
							console.log("添加失败", err)
							uni.showToast({
								title: '网络错误，添加失败',
								icon: 'error',
								duration: 1000,
							})
						})
				} else {
					uni.showLoading({
						title: '更新中...',
						mask: true,
					})
					let userInfo = uni.getStorageSync('UserInfo')
					db.collection("SysNotice").doc(id).update({
						notice: this.inputValue,
						editer: userInfo.name,
						updateTime: new Date()
					}).then(res => {
						uni.hideLoading()
						console.log("更新成功", res)
						uni.showToast({
							title: '更新成功',
							icon: 'success',
							duration: 1000,
						})
						// 刷新数据
						this.getSysNotice()
					}).catch(err => {
						uni.hideLoading()
						console.log("更新失败", err)
						uni.showToast({
							title: '更新失败',
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
	/* 输入框 */
	.box {
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.input_box {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		border-bottom: 1px #42A5F5 solid;
	}

	.input_label {
		width: 30%;
		font-size: 14px;
	}

	.input_text {
		width: 70%;
		font-size: 14px;
		color: #42A5F5;
	}

	/* 输入框 */

	/* 按钮 */
	.input_button {
		margin-top: 10rpx;
		width: 100%;
		height: 80rpx;
		display: inline-flex;
		color: #fff;
	}

	.input_button view {
		width: 50%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.cancle_btn {
		border-top-left-radius: 10rpx;
		border-bottom-left-radius: 10rpx;
	}

	.confirm_btn {
		border-top-right-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.bg_blue {
		background-color: #42A5F5;
	}

	.bg_green {
		background-color: green;
	}
</style>