/**
 * 读取目录文件树
 */

var fs = require("fs");

exports.read = function(dir, name){
	function readdir(dir, name){
		var files = fs.readdirSync(dir),
			_files = [];

		for(var i = 0, l = files.length, dirname; i < l; i ++){
			dirname = files[i];
			if(/^_/.test(dirname)){
				continue;
			}

			if(/\./.test(dirname)){
				_files.push(dirname);
			}else{
				_files.push(readdir(dir + "/" + dirname, dirname));
			}
		}
		return {
			"dir": name,
			"files": _files
		};
	}
	return readdir(dir, name || "root");
};