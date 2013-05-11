var config = require("../config.js"),
	project = require("../module/project.js");

module.exports = function(request, callback){
	project(request.postData.projectName, function(projectConfig){
		if(projectConfig){
			callback(JSON.stringify(projectConfig));
		}else{
			callback("");
		}
	});
};