<template>
	<view>
		<!-- 背景图 -->
		<view class="bg_box">
			<image :src="meTopImg != ''?meTopImg:'../../static/iconimg/defmetopbg.png'"></image>
		</view>

		<view class="main_page color_white">
			<!-- 选择头像 -->
			<view class="headimg" @click="toggle">
				<image class="avatar" :src="headImg != ''?headImg:'../../static/iconimg/addheadimg.png'"></image>
			</view>
			<!-- 弹出窗口 -->
			<view>
				<uni-popup ref="popup" safeArea backgroundColor="#fff">
					<scroll-view scroll-y="true" style="height: 500rpx;" @scrolltolower="lower">
						<!-- 九宫格 -->
						<view class="sudoku_box">
							<view class="sudoku_list">
								<view class="sudoku_item" v-for="item in SysHeadImg" :key="item._id">
									<image class="sudoku_item_img" :src="item.sysHeadImg" :data-img="item.sysHeadImg"
										@click="clickSudokuimg"></image>
								</view>
							</view>
						</view>
					</scroll-view>
				</uni-popup>
			</view>
			<!-- 填写昵称 -->
			<view class="name">
				<input placeholder-class="placeholder" placeholder="填写昵称" maxlength="30" :value="name" @input="inputName" />
			</view>
			<!-- 选择性别 -->
			<view class="gender">
				<view class="gender_item" :class="gender == '男'?'item_ckd':''" data-gender="男" @click="clickgender">
					<image src="../../static/iconimg/male.jpg"></image>
					<view class="gender_text">男</view>
				</view>
				<view class="gender_item" :class="gender == '女'?'item_ckd':''" data-gender="女" @click="clickgender">
					<image src="../../static/iconimg/female.jpg"></image>
					<view class="gender_text">女</view>
				</view>
			</view>

			<!-- 选择年龄 -->
			<view class="age">
				<view class="age_item" :class="age == '18'?'item_ckd':''" data-age="18" @click="clickage">16+</view>
				<view class="age_item" :class="age == '16'?'item_ckd':''" data-age="16" @click="clickage">16-</view>
			</view>
			<!-- 保存按钮 -->
			<button class="saveBtn" type="primary" @click="SubmitBtn">保存</button>

			<!-- 左边导航栏 -->
			<view class="LsideNavBox">
				<view class="NavItem">
					<image src="../../static/iconimg/back.png" @click="backPage"></image>
				</view>
			</view>

			<!-- 右边导航栏 -->
			<view class="RsideNavBox">
				<view class="NavItem">
					<button class="kefubtn" open-type="contact">
						<image src="@/static/iconimg/kefu.png"></image>
					</button>
				</view>
				<view class="NavItem">
					<image v-if="admin" src="@/static/iconimg/stagedoor.png" @click="goStagedoor"></image>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	var app = getApp();
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
				UserLogin: false,
				admin: false,
				meTopImg: "",
				SysHeadImg: [],
				UId: '',
				openId: '',
				headImg: '',
				name: '',
				gender: '男',
				age: '18'
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad() {
			console.log("个人中心onLoad")
			this.getSysMeTopImg()
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			console.log("个人中心onShow")
			this.openId = uni.getStorageSync('openid');
			this.getUserInfo()
		},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			console.log("个人中心onHide")
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			console.log("个人中心onUnload")
		},

		methods: {

			// 获取用户信息
			getUserInfo() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let openId = this.openId
				console.log("用户openid：", openId)
				db.collection("DuckUsers").where({
						"openid": openId,
					}).get()
					.then(res => {
						uni.hideLoading()
						console.log("用openid查询用户成功：", res.result.data)
						let data = res.result.data[0]
						this.UId = data._id
						this.headImg = data.headImg
						this.name = data.name
						this.gender = data.gender
						this.age = data.age
						this.admin = data.admin
						uni.setStorageSync('UserInfo', data) //保存用户信息保存到本地缓存
					}).catch(err => {
						uni.hideLoading()
						console.log("用openid查询用户失败：", err)
					})
			},

			// 获取系统顶部背景图片
			getSysMeTopImg() {
				db.collection("SysMeTopImg").get()
					.then(res => {
						console.log("获取系统顶部背景图片成功：", res.result.data)
						if (res.result.data.length > 0) {
							this.meTopImg = res.result.data[0].meTopImg
						}
					}).catch(err => {
						console.log("获取系统顶部背景图片失败：", err)
					})
			},

			// 打开模态框
			toggle() {
				this.$refs.popup.open('bottom')
				this.getSysHeadimg()
			},

			// 获取系统头像图片
			getSysHeadimg() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				db.collection("SysHeadImg").get()
					.then(res => {
						uni.hideLoading()
						console.log("获取系统头像数据成功：", res.result.data)
						if (res.result.data.length > 0) {
							this.SysHeadImg = res.result.data
						} else {
							let headArr = [] //初始系统可选用户头像（男、女）
							headArr.push({
								_id: 'male002132441',
								sysHeadImg: 'https://mp-03fe1f0f-7f8a-4957-9869-6fe45e570b5a.cdn.bspapp.com/cloudstorage/00b860d7-acfd-494e-b245-0adec3f5b3ce.jpg'
							}, {
								_id: 'female002132361',
								sysHeadImg: 'https://mp-03fe1f0f-7f8a-4957-9869-6fe45e570b5a.cdn.bspapp.com/cloudstorage/2473ce80-4356-49b8-b400-008bd10af899.jpg'
							})
							this.SysHeadImg = headArr
						}

					}).catch(err => {
						uni.hideLoading()
						console.log("获取系统头像数据失败：", err)
					})
			},

			// scroll-view滚动到底部
			lower(e) {
				console.log("滚动到底部：")
			},

			// 选择头像
			clickSudokuimg(e) {
				console.log('选择头像：', e.currentTarget.dataset.img)
				this.headImg = e.currentTarget.dataset.img
			},

			// 填写昵称
			inputName(e) {
				console.log('获取输入昵称成功', e.detail.value)
				this.name = e.detail.value
			},

			//点击性别项
			clickgender(e) {
				let gender = e.currentTarget.dataset.gender
				console.log('点击性别项：', gender)
				if (gender == "男") {
					this.gender = '男'
				} else {
					this.gender = '女'
				}
			},

			//点击年龄项
			clickage(e) {
				let age = e.currentTarget.dataset.age
				console.log('点击年龄项：', age)
				if (age == "16") {
					this.age = '16'

				} else {
					this.age = '18'
				}
			},

			// 确认提交按钮
			SubmitBtn() {
				let headImg = this.headImg
				let name = this.name
				let gender = this.gender
				let age = this.age
				let befUserInfo = uni.getStorageSync('UserInfo')
				console.log('确认提交按钮里的位置信息：', name, gender, age, headImg)
				if (headImg == "") {
					uni.showToast({
						title: '请选择头像！',
						icon: 'none',
						duration: 1000,
					})

				} else if (name == "") {
					uni.showToast({
						title: '请输入昵称！',
						duration: 1000,
						icon: "none"
					})
				} else if (gender == "") {
					uni.showToast({
						title: '请选择性别！',
						duration: 1000,
						icon: "none"
					})
				} else if (age == "") {
					uni.showToast({
						title: '请选择年龄！',
						duration: 1000,
						icon: "none"
					})
				} else if (befUserInfo != "") {
					if (headImg == befUserInfo.headImg && name == befUserInfo.name && gender == befUserInfo
						.gender && age == befUserInfo.age) {
						uni.showToast({
							title: '好像什么都没改变哦！',
							duration: 1000,
							icon: "none"
						})
					} else {
						this.SubmitData()
					}
				} else {
					this.SubmitData()
				}
			},

			// 提交数据
			SubmitData() {
				let openId = this.openId
				let Uid = this.UId
				let headImg = this.headImg
				let name = this.name
				let gender = this.gender
				let age = this.age
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				db.collection("DuckUsers").where({
						"openid": openId,
					}).get()
					.then(res => {
						console.log("用openid查询用户成功：", res.result.data)
						if (res.result.data.length == 0) {
							db.collection("DuckUsers").add({
								openid: openId,
								headImg,
								name,
								gender,
								age,
								level: Number(0),
								admin: false,
								registerTime: formatTime(new Date())
							}).then(res => {
								uni.hideLoading()
								console.log("写入成功", res)
								this.getUserInfo()
								uni.showToast({
									title: '录入成功',
									icon: 'success',
									duration: 1000,
								})
							}).catch(err => {
								uni.hideLoading()
								console.log("写入失败", err)
								uni.showToast({
									title: '录入失败',
									icon: 'error',
									duration: 1000,
								})
							})
						} else {
							db.collection("DuckUsers").doc(Uid).update({
								headImg,
								name,
								gender,
								age,
								updateTime: formatTime(new Date())
							}).then(res => {
								uni.hideLoading()
								console.log("更新成功", res)
								this.getUserInfo()
								uni.showToast({
									title: '更新成功',
									icon: 'success',
									duration: 1000,
								})
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
					}).catch(err => {
						uni.hideLoading()
						console.log("用openid查询用户失败：", err)
					})
			},

			// 跳转后台页面
			goStagedoor() {
				uni.navigateTo({
					url: '/pages/backstage/backstageHome/backstageHome'
				})
			},
			// 返回上一页
			backPage() {
				uni.navigateBack({
					delta: 1
				})
			},

		}
	}
</script>

<style>
	/* 背景图 */
	.bg_box {
		width: 100%;
		height: 400rpx;
	}

	.bg_box image {
		width: 100%;
		height: 100%;
		border-radius: 0rpx 0rpx 30rpx 30rpx;
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	/* 头像框 */
	.headimg {
		margin: 15rpx auto;
		padding: 10rpx;
		width: 250rpx;
		height: 250rpx;
		backdrop-filter: blur(10px);
		border-radius: 18rpx;
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.headimg image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
		overflow: hidden;
	}

	/* 九宫格 */
	.sudoku_list {
		padding: 10rpx;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
	}

	.sudoku_item {
		width: 180rpx;
		margin: 4rpx;
		padding: 4rpx;
	}

	.sudoku_item_img {
		margin-top: 10rpx;
		margin-left: 10rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 75rpx;
		overflow: hidden;
		box-shadow: 4px 4px 8px rgba(99, 95, 95, 0.6);
	}

	/* 填写昵称 */
	.name {
		margin: 20rpx auto;
		padding: 5rpx;
		width: 290rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: white;
		overflow: hidden;
		backdrop-filter: blur(10px);
		border-radius: 18rpx;
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.name input {
		height: 70rpx;
		line-height: 70rpx;
	}

	.placeholder {
		color: white;
		text-align: center;
	}

	/* 选择性别 */
	.gender {
		margin: 20rpx auto;
		width: 300rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		backdrop-filter: blur(10px);
		border-radius: 18rpx;
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.gender_item {
		margin: 10rpx;
		width: 80rpx;
		text-align: center;
	}

	.gender_item image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
		box-shadow: 4px 4px 8px rgba(99, 95, 95, 0.6);
	}

	.item_ckd {
		padding: 4rpx;
		border-radius: 30rpx;
		background-color: rgba(10, 223, 10, 0.4);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	/* 选择年龄 */
	.age {
		margin: 20rpx auto;
		width: 300rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		backdrop-filter: blur(10px);
		border-radius: 18rpx;
		background: rgba(250, 250, 250, 0.5);
		box-shadow: 4px 4px 8px rgba(141, 138, 138, 0.5);
	}

	.age_item {
		margin: 10rpx;
		width: 80rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 18rpx;
	}

	/* 保存按钮 */
	.saveBtn {
		margin: 50rpx auto;
		width: 250rpx;
		color: white;
		text-align: center;
		border-radius: 18rpx;
	}

	/* 左侧导航栏 */
	.LsideNavBox {
		position: fixed;
		left: 15rpx;
		bottom: 40rpx;
		display: flex;
		flex-direction: column;
	}

	.LsideNavBox image {
		width: 80rpx;
		height: 80rpx;
	}

	/* 右侧边导航栏 */
	.RsideNavBox {
		position: fixed;
		right: 15rpx;
		bottom: 40rpx;
		display: flex;
		flex-direction: column;
	}

	.RsideNavBox image {
		border: none;
		width: 80rpx;
		height: 80rpx;
	}

	/* 导航栏子项 */
	.NavItem {
		margin: 10rpx;
	}

	.kefubtn::after {
		border: none;
	}

	.kefubtn {
		padding: 0;
		margin: 0;
		border: none;
		background-color: transparent;
	}
</style>