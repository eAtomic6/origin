//获取文件的后缀
function get_suffix(filename) {
	let pos = filename.lastIndexOf('.')
	let suffix = ''
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

//设置请求参数
function set_upload_param(up,param, filename,infoname='')
{
	if (filename != '') {
		// let suffix = get_suffix(filename);
		param.key = `${param.key}${filename}`;
	}
	let new_multipart_params = {
		'key' : param.key,
		'policy': param.policy,
		'OSSAccessKeyId': param.accessid,
		'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
		'x-oss-object-acl' : param.acl,
		'signature': param.signature,
    'Content-Disposition':`attachment;filename=${encodeURI(infoname)};filename*=UTF-8''${encodeURI(infoname)}`
	};
	up.setOption({
		'url': param.host,
		'multipart_params': new_multipart_params
	});

	up.start();
}

export {
  set_upload_param,
  get_suffix
}
