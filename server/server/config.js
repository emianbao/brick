/**
 * 服务运行配置
 */
module.exports = {
	cache: {
		// 匹配文件
		match: /^(js|css|html|txt)$/ig,
		// 缓存时间
		//maxAge: 60 * 60 * 24 * 365
		maxAge: 0
	},
    gzip: {
		match: /^(css|js|html)$/ig
	},
	// 文件类型对应的处理程序
	program: (function(config){
		var hash = {},
			_config,
			program,
			exts,
			_i, _l;
		for(var i = 0, l = config.length; i < l; i ++){
			_config = config[i];
			program = _config.program;
			exts = _config.ext;
			for(_i = 0, _l = exts.length; _i < _l; _i ++){
				hash[exts[_i]] = program;
			}
		}
		return hash;
	})([{
		// 可执行文件
		program: "./program/exe",
		ext: ["ihezhu"]
	}, {
		// 模版文件
		program: "./program/template",
		ext: ["tpl"]
	}, {
		// 静态文件
		program: "./program/static",
		ext: ["html", "js", "css", "jpg", "png", "gif", "ico"]
	}, {
		program: "./program/chtml",
		ext: ["chtml"]
	}]),
	// 默认页面
	default: "/index.html"
};