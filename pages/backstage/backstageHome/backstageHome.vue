<template>
	<view>
		<!-- 九宫格 -->
		<view class="sudoku_root">
			<view class="sudoku_item" data-url="../miniApp/miniApp" @click="Navigate">
				<image class="sudoku_item_img" src="../../static/iconimg/miniapp.png"></image>
				<text class="sudoku_item_title">小程序</text>
			</view>
			<view class="sudoku_item" data-url="../adminList/adminList" @click="Navigate">
				<image class="sudoku_item_img" src="../../static/iconimg/admin.png"></image>
				<text class="sudoku_item_title">管理员</text>
			</view>
		</view>
		<!-- 底部标题 -->
		<view class="bottom_title">后台管理系统</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},

		methods: {
			// 跳转函数
			Navigate(e) {
				let url = e.currentTarget.dataset.url
				wx.navigateTo({
					url: `${url}`,
				})
			},
		}
	}
</script>

<style>
	/* 九宫格 */
	.sudoku_root {
		padding: 10rpx;
		display: flex;
		margin-top: 20rpx;
		justify-content: space-around;
	}

	.sudoku_item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 216rpx;
		height: 216rpx;
		vertical-align: middle;
		border-radius: 16rpx;
		border-top: white solid 6rpx;
		border-left: white solid 6rpx;
		backdrop-filter: blur(10px);
		/* background-color: #fff; */
		background: rgba(250, 250, 250, 0.8);
		box-shadow: 20rpx 20rpx 10rpx rgba(39, 48, 57, 0.5);
	}

	.sudoku_item_img {
		width: 134rpx;
		height: 134rpx;
		margin-top: 10rpx;
	}

	.sudoku_item_title {
		font-size: 35rpx;
		margin-top: 10rpx;
	}

	/* 底部标题 */
	.bottom_title {
		color: #fff;
		width: 100%;
		display: flex;
		position: fixed;
		flex-direction: column;
		align-items: center;
		bottom: 0;
	}
</style>
