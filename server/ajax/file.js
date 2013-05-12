var fs = require("fs"),
	project = require("../module/project.js");

module.exports = function(request, callback){
	var postData = request.postData,
		file = postData.file,
		projectName = postData.projectName;

	project(projectName, function(projectConfig){
		if(projectConfig){
			file = projectConfig.root + projectConfig.srcScriptRoot + "/" + file;
			fs.readFile(file, "utf8", function(err, data){
				if(err){
					callback("");
				}else{
					callback(data);
				}
			});
		}else{
			callback("");
		}
	});
};