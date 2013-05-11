/**
 * 分析脚本依赖，合并脚本文件
 */
var fs = require("fs"),
	path = require("path");


var comboHeader = ["(function(){",
					"	var modules = {},",
					"		require = function(uri){",
					"			return modules[uri]",
					"		},",
					"		module = {",
					"			exports:{}",
					"		};"].join("\n"),
	comboFooter = ["	Fan.modules = modules;",
				"})()"].join("\n"),
	fileHeader = ["(function(){",
				"	var exports = module.exports = {};\n"].join("\n"),
	fileFooter = ["\n	return module.exports;",
				"})();"].join("\n"),
	// UTF-8 BOM头
	BOMHeader = new Buffer("\xef\xbb\xbf", "binary").toString("utf8");

var config = require("../config.js")
	comboConfig = require("./config.js"),
	baseScriptRoot = config.root + comboConfig.baseScriptRoot,
	depsParse = require("../module/deps.js");

// 合并
module.exports = function(files, projectConfig){
		// 源文件代码列表
	var code = [],
		// 模块加载状态
		status = {},
		// 合并失败列表
		failList = [],
		// 源文件目录
		srcRoot = projectConfig.root + projectConfig.srcScriptRoot,
		hander = 1;

	function loadMod(filenames){
		var pathname,
			pathtype,
			_code,
			deps,
			ext,
			program,
			result,
			depsStatus = [],
			_depsStatus;
		for(var i = 0, l = filenames.length; i < l; i ++){
			pathtype = filenames[i].type;
			pathname = filenames[i].path;
			if(pathtype === "relative"){
				pathname = srcRoot + "/" + pathname;
			}else if(pathtype === "base"){
				pathname = baseScriptRoot + "/" + pathname;
			}

			if(!(depsStatus[i] = status[pathname])){
				depsStatus[i] = status[pathname] = hander ++;

				ext = path.extname(pathname);
				ext = ext ? ext.slice(1) : 'unknown';

				program = comboConfig.program[ext];
				if(program){
					program = require(program);
					_code = program(pathname, status);
					if(_code){
						deps = depsParse.get(_code, pathname);
						_depsStatus = loadMod(deps);
						_code = depsParse.replace(_code, _depsStatus);
						code.push("modules['" + status[pathname] + "'] = " + fileHeader + _code.replace(BOMHeader, "") + fileFooter);
					}else{
						failList.push(pathname);
						console.log("fail load:" + pathname);
					}
				}else{
					failList.push(pathname);
					console.log("fail ext:" + pathname);
				}
			}
		}
		return depsStatus;
	}

	loadMod(files);

	code.unshift(comboHeader);
	code.push(comboFooter);
	// 合并源码
	return code.join("\n");
};