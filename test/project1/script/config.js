module.exports = {
	// 根目录
	root: "E:/github/brick/test/project1/script",
	// 脚本源码根目录
	srcScriptRoot: "/src",
	// 发布脚本根目录
	releaseScriptRoot: "/release",
	// 合并配置
	combo: (function(_config){
		var config = {};
		for(var dir in _config){
			(function(_dir, _config){
				if(_config instanceof Array){
					config[_dir] = _config;
				}else{
					for(var dir in _config){
						arguments.callee(_dir + "/" + dir, _config[dir]);
					}
				}
			})(dir, _config[dir]);
		}
		return config;
	})({
		"index": {
			"index.js": [
				'view/index/template/list.tpl',
				'view/index/chtml/filter/filter.chtml'
			]
		}
	})
};