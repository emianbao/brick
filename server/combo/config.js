module.exports = {
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
		// 模版文件
		program: "./program/template",
		ext: ["tpl"]
	}, {
		// 静态文件
		program: "./program/static",
		ext: ["js"]
	}, {
		// 子控件
		program: "./program/chtml",
		ext: ["chtml"]
	}, {
		program: "./program/css",
		ext: ["css"]
	}]),
	baseScriptRoot: "/base"
};