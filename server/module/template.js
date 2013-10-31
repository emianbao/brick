var fs = require("fs");

module.exports = {
	toFn: function(template){
		try {
			template = "$>" + template.replace(/<!\-\-[\s\S]*?\-\->/g, "").replace(/\n+/g, "") + "<$";
			return "function(GlobalData){var __result__ = [];" + template.replace(/<\$= ([\s\S]*?) \$>/g, function (a, b) {
				//return "<$ __result__.push(" + b.replace(/\\"/g, "\"").replace(/\\\\/g, "\\") + "); $>";
				return "<$ __result__.push(" + b + "); $>";
			}).replace(/\$>([\s\S]*?)<\$/g, function (a, b) {
				if (/^\s*$/.test(b))
					return "";
				else
					return "__result__.push(\"" + b.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\");";
			}) + "return __result__.join('');}";
		} catch (e) {
			return "function(){}";
		}
	},
	// 将模版转换为一个commonjs模块
	trans: function(template){
		try {
			template = "$>" + template.replace(/<!\-\-[\s\S]*?\-\->/g, "").replace(/\n+/g, "") + "<$";
			var deps = [];
			template = template.replace(/<\$# ([\s\S]*?) \$>/g, function(a, b){
				b = b.split(/\s*=\s*/);
				deps.push("var " + b[0] + " = require('" + b[1] + "');\n");
				return "";
			});
			return deps.join("") + "module.exports = function(GlobalData){var __result__ = [];" + template.replace(/<\$= ([\s\S]*?) \$>/g, function (a, b) {
				//return "<$ __result__.push(" + b.replace(/\\"/g, "\"").replace(/\\\\/g, "\\") + "); $>";
				return "<$ __result__.push(" + b + "); $>";
			}).replace(/\$>([\s\S]*?)<\$/g, function (a, b) {
				if (/^\s*$/.test(b))
					return "";
				else
					return "__result__.push(\"" + b.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\");";
			}) + "return __result__.join('');}";
		} catch (e) {
			return "module.exports = function(){}";
		}
	},
	// 读取filename文件中的模版并转换
	get: function(filename){
		if(fs.existsSync(filename)){
			var code = fs.readFileSync(filename, 'utf8');
			return this.trans(code);
		}
		return "";
	}
};