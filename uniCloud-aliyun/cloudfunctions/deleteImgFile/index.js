'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let result = await uniCloud.deleteFile({
		fileList: event.imgArr
	});
	//返回数据给客户端
	return result;
};
