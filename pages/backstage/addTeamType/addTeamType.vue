<template>
	<view>
		<view class="box">
			<!-- 队伍类型 -->
			<view class="input_item">
				队伍类型：<input placeholder="填写队伍类型" :value="teamType" @input="inputData" />
			</view>
			<view class="input_button">
				<view class="bg_blue cancle_btn" @click="closeInput">取 消</view>
				<view class="bg_green confirm_btn" @click="confirmSubmit">确认添加</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				teamType: '',
			}
		},
		methods: {
			/**
			 * 获取输入框数据
			 */
			inputData(e) {
				this.teamType = e.detail.value
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
				let teamType = this.teamType
				if (teamType == "") {
					uni.showToast({
						title: '填写队伍类型！',
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
				uni.showLoading({
					title: '添加中...',
					mask: true,
				})
				db.collection('SysTeamType')
					.add({
						teamType: this.teamType
					})
					.then(res => {
						uni.hideLoading()
						console.log("添加成功", res)
						uni.showToast({
							title: '添加成功',
							icon: 'success',
							duration: 1000,
						})
						// 返回
						uni.navigateBack({
							delta: 1,
						})
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

	.input_item {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		display: inline-flex;
		border-bottom: 1px #42A5F5 solid;
	}

	.input_item label {
		display: inline-flex;
		font-size: 15px;
		font-weight: bold;
	}

	.input_item input {
		padding: 10rpx;
	}

	.input_item text {
		padding: 10rpx;
	}


	.input_desc {
		margin: 40rpx 0rpx;
		font-size: 14px;
		color: grey;
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
