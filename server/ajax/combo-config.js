var fs = require("fs"),
	project = require("../module/project.js");

module.exports = function(request, callback){
	project(request.postData.projectName, function(projectConfig){
		if(projectConfig){
			callback(JSON.stringify(projectConfig.combo));
		}else{
			callback("");
		}
	});

};