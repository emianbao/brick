var url = require("url")
	,path = require("path"),
	serverConfig = require("./config.js");

module.exports = function(config){
	return function (request, response) {
		// 请求路径
		var pathName = url.parse(request.url).pathname;
		pathName = path.normalize(pathName.replace(/\.\./g, ""));
		if(pathName === "\\"){
			pathName += config.default;
		}
		// 是否为seajs
		var seajs = false;
		if(/^\\seajs/.test(pathName)){
			seajs = true;
			pathName = pathName.replace(/^\\seajs/, "");
		}
		// 文件类型(不带类型默认是html)
		var ext = path.extname(pathName);
		//ext = ext ? ext.slice(1) : 'unknown';
		if(ext){
			ext = ext.slice(1);
		}else{
			ext = "html";
			pathName += ".html";
		}

		// 根据文件类型做相应处理
		var program = serverConfig.program[ext];
		if(program){
			require(program)(request, response, {
				// 项目配置
				projectConfig: config,
				// 请求路径
				pathName: pathName,
				// 本地路径
				realPath: config.root + pathName,
				// 文件类型
				ext: ext,
				// 是否为seajs
				seajs: seajs
			});
		}else{
			// 无法处理的文件类型
	        response.writeHead(404, {
	            'Content-Type': 'text/plain'
	        });

	        response.write("This request " + ext + " was error ext.");
	        response.end();
		}
	};
};