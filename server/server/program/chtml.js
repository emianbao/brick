var chtmlParse = require("module/chtml/chtml-parse.js"),
	mime = require("../mime"),
	seajs = require("./seajs");

module.exports = function(request, response, other){
	var code = chtmlParse(other.realPath);
	response.setHeader("Content-Type", mime[other.ext]);
	response.writeHead(200, "Ok");
	if(other.seajs){
		response.write(seajs.header);
		response.write(code);
		response.write(seajs.footer);
	}else{
		response.write(code);
	}
	response.end();
};