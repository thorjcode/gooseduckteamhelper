<template>
	<view>
		<view class="box">
			<!-- 选择图片 -->
			<view class="cu-form-group" style="margin-top: 40rpx;">
				<view class="title">
					<text><text style="color:#EE0A24;">*</text>选择图片（{{Img.length}}/1）</text>
				</view>
			</view>
			<view class="cu-form-group" style="padding-left:5px;">
				<view class="grid col-1 grid-square flex-sub">
					<view class="solids" @click="CoverImg" v-if="isCoverImg">
						<text class="iconfont icon_add_img"></text>
					</view>

					<view class="bg-img" v-else>
						<image :src='Img' mode='aspectFill' @click="PWCoverImg"></image>
						<view class="cu-tag bg-red" :data-img="Img" @click="DECoverImg">
							<text class="iconfont icon_x_img"></text>
						</view>
					</view>

				</view>
			</view>

			<view class="input_button">
				<view class="bg_blue cancle_btn" @click="closeInput">取消</view>
				<view class="bg_green confirm_btn" @click="confirmSubmit">添加</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				inputValue: '',
				Img: [],
				isCoverImg: true,
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad() {
			this.getSysMeTopImg()
		},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			console.log("添加我的页面背景onHide")
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			console.log("添加我的页面背景onUnload")
			uni.removeStorageSync('SysMeTopImg')
		},
		methods: {
			// 获取系统顶部背景图片
			getSysMeTopImg() {
				this.Img = []
				this.isCoverImg = true
				db.collection("SysMeTopImg").get()
					.then(res => {
						console.log("获取系统顶部背景图片成功：", res.result.data)
						if (res.result.data.length > 0) {
							this.Img.push(res.result.data[0].meTopImg)
							this.isCoverImg = false
							uni.setStorageSync('SysMeTopImg', res.result.data[0])
						} else {
							this.Img = []
							this.isCoverImg = true
						}
					}).catch(err => {
						console.log("获取系统顶部背景图片失败：", err)
					})
			},

			/**
			 * 选择图片
			 */
			CoverImg() {
				uni.chooseImage({
					count: 1, //张数
					sizeType: ['compressed'], //压缩图
					sourceType: ['album'], //从相册选择
					success: res => { //chooseImage-success方法，返回类型是数组
						this.Img = res.tempFilePaths
						this.isCoverImg = false
					},
					fail: err => {
						console.log('获取图片失败', err)
						this.isCoverImg = true
					}
				});
			},
			/**
			 * 大图预览
			 */
			PWCoverImg(e) {
				uni.previewImage({ //大图预览,需要的类型是数组
					urls: this.Img,
					current: e.currentTarget.dataset.url
				});
			},
			/**
			 * 删除图片
			 */
			DECoverImg(e) {
				console.log('点击了X删除图片，要删除的图片：', e.currentTarget.dataset.img)
				if (e.currentTarget.dataset.img[0].includes("http://tmp/") || e.currentTarget.dataset.img[0].includes(
						"wxfile://")) {
					this.Img.splice(e.currentTarget.dataset.index, 1)
					this.isCoverImg = true
				} else {
					this.delImg()
				}
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
			confirmSubmit(e) {
				let Img = this.Img
				let befInfo = uni.getStorageSync('SysMeTopImg')
				if (Img.length == 0) {
					uni.showToast({
						title: '请选择图片！',
						duration: 1000,
						icon: "none"
					})
				} else if (Img == befInfo.meTopImg) {
					uni.showToast({
						title: '请选择新图片！',
						duration: 1000,
						icon: "none"
					})
				} else {
					this.addImg()
				}
			},

			// 添加图片
			addImg() {
				uni.showLoading({
					title: '上传中...',
					mask: true,
				})
				const fileName = this.Img[0];
				let cloudPath = "metopimg" + Date.now() + Math.floor(Math.random(0, 1) * 10000000) + '.jpg';
				uniCloud.uploadFile({
						cloudPath,
						filePath: fileName
					})
					.then(res => {
						console.log('上传图片成功：', res)
						if (res.success) {
							db.collection('SysMeTopImg').add({
									meTopImg: res.fileID
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
									this.getSysMeTopImg()
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
						}
					}).catch(err => {
						uni.hideLoading()
						console.log('上传图片失败：', err)
						uni.showToast({
							title: '上传图片失败！',
							icon: 'none',
							duration: 1000,
						})
					})
			},

			// 清除图片
			delImg() {
				uni.showLoading({
					title: '清除中...',
					mask: true,
				})
				let befInfo = uni.getStorageSync('SysMeTopImg')
				let imgArr = []
				imgArr.push(befInfo.meTopImg)
				uniCloud.callFunction({
					name: "deleteImgFile",
					data: {
						imgArr
					}
				}).then(res => {
					console.log('删除云存储文件成功：', res)
					db.collection('SysMeTopImg').doc(befInfo._id).remove({})
						.then(res => {
							uni.hideLoading()
							console.log("清除成功", res)
							uni.showToast({
								title: '清除成功',
								icon: 'success',
								duration: 1000,
							})
							// 刷新数据
							this.Img = []
							uni.removeStorageSync('SysMeTopImg')
							// 刷新数据
							this.getSysMeTopImg()
						}).catch(err => {
							uni.hideLoading()
							console.log("清除失败", err)
							uni.showToast({
								title: '网络错误，清除失败！',
								icon: 'error',
								duration: 1000,
							})
						})

				}).catch(err => {
					uni.hideLoading()
					console.log('删除云存储文件失败：', err)
				})
			}
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
