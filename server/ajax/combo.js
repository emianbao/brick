var fs = require("fs"),
	combo = require("../combo/combo.js"),
	zip = require("../module/zip.js"),
	project = require("../module/project.js");

function _combo(file, projectConfig, needZip){
		// 源文件列表
	var files = projectConfig.combo[file] || [file],
		// 压缩目标文件
		releaseScript = projectConfig.root + projectConfig.releaseScriptRoot + "/" + file;

	var _files = [];
	for(var i = 0, l = files.length; i < l; i ++){
		_files[i] = {
			type: "relative",
			path: files[i]
		};
	}

	var code = combo(_files, projectConfig);
	if(needZip){
		code = zip(code);
	}
	// 写入目标文件
	fs.writeFileSync(releaseScript, code, 'utf8');
	return true;
}

module.exports = function(request, callback){
	var postData = request.postData,
		file = postData.file,
		zip = postData.zip == "true",
		projectName = postData.projectName;

	project(projectName, function(projectConfig){
		if(projectConfig){
			var result = {};
			if(file){
				result[file] = _combo(file, projectConfig, zip);
			}else{
				var comboConfig = projectConfig.combo;
				for(file in comboConfig){
					result[file] = _combo(file, projectConfig, zip);
				}
			}
			callback(JSON.stringify(result));
		}else{
			callback("");
		}
	});

};