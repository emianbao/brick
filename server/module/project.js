var config = require("../config.js"),
	fs = require("fs");

module.exports = function(projectName, callback){
	var projectPath = config.projects[projectName];
	if(projectPath){
		projectPath = projectPath.path + "/config.js";
		fs.exists(projectPath, function(exists){
			if(exists){
				var projectConfig = require(projectPath);
				callback(projectConfig);
			}else{
				callback(null);
			}
		});
	}else{
		callback(null);
	}
};