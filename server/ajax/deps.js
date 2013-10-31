var fs = require("fs"),
	path = require("path");

var serverConfig = require("../config.js")
	comboConfig = require("../combo/config.js"),
	baseScriptRoot = serverConfig.root + comboConfig.baseScriptRoot + "/",
	depsParse = require("../module/deps.js"),
	project = require("../module/project.js");

var getDeps = function(files, projectConfig){
		// 模块加载状态
	var status = {},
		// 依赖列表
		deps = [],
		// 合并失败列表
		failList = [],
		// 源文件目录
		srcRoot = projectConfig.root + projectConfig.srcScriptRoot + "/";

	function loadMod(files){
		var type,
			filePath,
			ext,
			program,
			code,
			_files;
		for(var i = 0, l = files.length; i < l; i ++){
			type = files[i].type;
			filePath = files[i].path;
			if(type === "relative"){
				filePath = srcRoot + filePath;
			}else if(type === "base"){
				filePath = baseScriptRoot + filePath;
			}

			if(!status[filePath]){
				status[filePath] = true;

				ext = path.extname(filePath);
				ext = ext ? ext.slice(1) : 'unknown';

				program = comboConfig.program[ext];
				if(program){
					program = require("../combo/" + program);
					code = program(filePath, status);
					if(code){
						_files = depsParse.get(code, filePath);
						loadMod(_files);
						filePath = filePath.replace(baseScriptRoot, "$").replace(srcRoot, "");
						deps.push(filePath);
					}
				}else{
					failList.push(filePath);
				}
			}
		}
	}

	loadMod(files);

	return deps;
};

module.exports = function(request, callback){
	var postData = request.postData,
		file = postData.file,
		projectName = postData.projectName;

	project(projectName, function(projectConfig){
		if(projectConfig){
			file = projectConfig.root + projectConfig.srcScriptRoot + "/" + file;

			var files = getDeps([{
				type: "absolute",
				path: file
			}], projectConfig);

			callback(JSON.stringify(files));
		}else{
			callback("");
		}
	});
};