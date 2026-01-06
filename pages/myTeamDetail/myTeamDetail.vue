<template>
	<view>
		<view class="main_page color_white" v-for="item in MyTeamList" :key="item._id">
			<view class="sudoku_list">
				<!-- 房间号 -->
				<view class="sudoku_item">
					<view class="title" :data-id="item.teamId" @click="copyTeamId">房间号：{{item.teamId}}
						<image class="copyimg" src="@/static/iconimg/copy.png"></image>
					</view>
				</view>
				<!-- 队伍名 -->
				<view class="sudoku_item">
					<view class="title">队伍名：{{item.teamName}}</view>
				</view>
				<!-- 状态 -->
				<view class="sudoku_item" :style="item.begin?'background-color: #00CC66;':''">
					<view class="title">状态：{{item.begin?"已开始":"准备中"}}</view>
				</view>
			</view>
			<!-- 队伍类型 -->
			<view class="sudoku_list">
				<view class="sudoku_item">
					<view class="title">队伍类型：{{item.teamType}}</view>
				</view>
			</view>
			<!-- 游戏模式 -->
			<view class="sudoku_list">
				<view class="sudoku_item">
					<image class="item_img" :src="item.modeImg"></image>
					<view class="title">游戏模式：{{item.modeName}}</view>
				</view>
			</view>
			<!-- 游戏地图 -->
			<view class="sudoku_list">
				<view class="sudoku_item">
					<image class="item_img" :src="item.mapImg"></image>
					<view class="title">游戏地图：{{item.mapName}}</view>
				</view>
			</view>
			<!-- 确定按钮 -->
			<button v-if="!begin" class="main_margin_20rpx" type="primary" @click="BeginBtn">开始游戏</button>
			<button class="main_margin_20rpx" type="primary" @click="deleteBarModal">解散队伍</button>
			<!-- 底部填充盒子 -->
			<view class="bottom_fill_box"></view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				begin: false,
				Id: '',
				MyTeamList: []
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.Id = options.id
			console.log('传过来的id', options.id)
			this.getTeamInfo()
		},
		methods: {
			//查询队伍信息
			getTeamInfo() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let Id = this.Id
				db.collection('TeamHall').where({
						'_id': Id
					})
					.get()
					.then(res => {
						uni.hideLoading()
						console.log("获取我的组队数据成功：", res.result.data)
						this.MyTeamList = res.result.data
						this.begin = res.result.data[0].begin
					}).catch(err => {
						uni.hideLoading()
						console.log("获取我的组队数据失败：", err)
					})
			},


			// 复制房间号
			copyTeamId(e) {
				uni.setClipboardData({
					data: e.currentTarget.dataset.id,
				})
			},

			// 开始游戏
			BeginBtn() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let Id = this.Id
				db.collection('TeamHall').doc(Id).update({
						begin: true,
						beginTime: new Date()
					})
					.then(res => {
						uni.hideLoading()
						console.log("开始游戏成功", res)
						//返回
						uni.navigateBack({
							delta: 1
						})

					}).catch(err => {
						uni.hideLoading()
						console.log("开始游戏失败", err)
						uni.showToast({
							title: '网络错误，开始失败！',
							icon: 'error',
							duration: 1000,
						})
					})
			},

			// 删除提示
			deleteBarModal() {
				uni.showModal({
					title: '温馨提醒',
					content: '确定解散该队伍吗',
					mask: true,
					success: res => {
						if (res.confirm) {
							// 跳转解散队伍
							this.deleteTeam()
						}
					}
				})
			},
			// 解散队伍
			deleteTeam() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let Id = this.Id
				db.collection('TeamHall').doc(Id).remove({})
					.then(res => {
						uni.hideLoading()
						console.log("解散成功", res)
						//返回
						uni.navigateBack({
							delta: 1
						})

					}).catch(err => {
						uni.hideLoading()
						console.log("解散失败", err)
						uni.showToast({
							title: '网络错误，解散失败！',
							icon: 'error',
							duration: 1000,
						})
					})
			},
		}
	}
</script>

<style>
	/* 标题 */
	.title {
		margin: 20rpx;
		font-size: 18px;
	}

	/* 栏目列表 */
	.sudoku_list {
		margin: 15rpx;
		padding: 10rpx;
		height: auto;
		display: flex;
		/* flex-wrap: wrap; */
		flex-direction: column;
		justify-content: center;
		border-radius: 16rpx;
		border-top: white solid 6rpx;
		border-left: white solid 6rpx;
		backdrop-filter: blur(10px);
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.sudoku_item {
		border-radius: 16rpx;
		text-align: center;
	}

	.item_img {
		margin: 15rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 4px 4px 8px rgba(99, 95, 95, 0.6);
	}

	/* 复制图标 */
	.copyimg {
		width: 40rpx;
		height: 40rpx;
	}
</style>
