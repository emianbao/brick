/**
 * 可执行程序处理
 */
var url = require("url"),
	querystring = require("querystring");

module.exports = function(request, response, other){
	var realPath = other.realPath.replace(new RegExp("\\." + other.ext + "$"), ".js");
	var process = require(realPath),
		postData;
	if(request.method === "POST")
	{
		postData = [];
		request.addListener("data", function(postDataChunk) {
			postData.push(postDataChunk);
		});

		request.addListener("end", function() {
			postData = querystring.parse(postData.join(""));

			process({
				method: "POST",
				postData: postData
			}, function(result){
				response.writeHead(200, "Ok");
				response.write(result);
				response.end();
			});
		});
	}else{
		postData = url.parse(request.url).query;
		postData = querystring.parse(postData);
		process({
			method: "GET",
			postData: postData
		}, function(result){
			response.writeHead(200, "Ok");
			response.write(result);
			response.end();
		});
	}
};