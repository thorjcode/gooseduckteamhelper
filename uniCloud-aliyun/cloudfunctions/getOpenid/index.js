'use strict';
const mp_wx_data = {
	AppID: 'wx9926ec6961386730', //小程序AppID
	AppSecret: '78e40a5a30fce13727f043167932c7ab' //小程序密钥
}
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const res = await uniCloud.httpclient.request(
		'https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			data: {
				appid: mp_wx_data.AppID,
				secret: mp_wx_data.AppSecret,
				js_code: event.js_code,
				grant_type: 'authorization_code'
			},
			dataType: 'json'
		}
	)
	//返回数据给客户端
	return res;
};