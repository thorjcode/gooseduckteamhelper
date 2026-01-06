<template>
	<view>
		<view class="box">
			<!-- 输入框 -->
			<view class="input_item">
				头像名称：<input placeholder="填写头像名称" :value="inputValue" @input="inputData" />
			</view>

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
						<view class="cu-tag bg-red" @click="DECoverImg">
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
				ImgID: [],
				isCoverImg: true,
			}
		},
		methods: {
			/**
			 * 获取输入框数据
			 */
			inputData(e) {
				this.inputValue = e.detail.value
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
				this.Img.splice(e.currentTarget.dataset.index, 1)
				this.isCoverImg = true
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
				let inputValue = this.inputValue
				if (inputValue == "") {
					uni.showToast({
						title: '填写地图名称！',
						duration: 1000,
						icon: "none"
					})
				} else if (Img.length == 0) {
					uni.showToast({
						title: '请选择图片！',
						duration: 1000,
						icon: "none"
					})
				} else {
					this.addImg()
				}
			},

			/**
			 * 上传图片
			 */
			addImg() {
				uni.showLoading({
					title: '上传中...',
					mask: true,
				})
				const fileName = this.Img[0];
				let cloudPath = this.inputValue + Date.now() + Math.floor(Math.random(0, 1) * 10000000) + '.jpg';
				uniCloud.uploadFile({
						cloudPath,
						filePath: fileName
					})
					.then(res => {
						console.log('上传图片成功：', res)
						if (res.success) {
							db.collection('SysHeadImg')
								.add({
									headName: this.inputValue,
									sysHeadImg: res.fileID
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
						}

					})
					.catch(err => {
						uni.hideLoading()
						console.log('上传图片失败：', err)
						uni.showToast({
							title: '上传图片失败！',
							icon: 'none',
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
