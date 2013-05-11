/**
 * 服务主程序
 */
 
var config = require("../config.js")
	,client_server = require("./_client_server.js")
	,listen = require("./listen.js");

var http = require("http")
	,url = require("url")
	,path = require("path")
	,fs = require("fs");

module.exports = function(projectName){
	var projectConfig = config.projects[projectName];
	if(projectConfig){
		var projectPath = projectConfig.path + "/config.js",
			projectPort = projectConfig.port;
		fs.exists(projectPath, function(exists){
			if(exists){
				projectConfig = require(projectPath);
				var server = http.createServer(client_server(projectConfig));
				listen(server, projectPort);
				console.log("project: " + projectName + " runing at port: " + projectPort + ".");
				//callback(server);
			}else{
				//callback(null);
			}
		});
	}else{
		//callback(null);
	}
};