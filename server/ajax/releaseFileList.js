var project = require("../module/project.js"),
	readdir = require("../module/readdir").read;


module.exports = function(request, callback){
	var projectName = request.postData.projectName;
	project(projectName, function(projectConfig){
		if(projectConfig){
			var files = readdir(projectConfig.root + projectConfig.releaseScriptRoot, "release");
			callback(JSON.stringify(files));
		}else{
			callback("");
		}
	});
};