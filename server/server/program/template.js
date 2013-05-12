/**
 * 模版文件处理
 */
var parseTemplate = require("../../module/template.js"),
	mime = require("../mime"),
	seajs = require("./seajs");
module.exports = function(request, response, other){
	var template = parseTemplate.get(other.realPath);
	response.setHeader("Content-Type", mime["template"]);
	response.writeHead(200, "Ok");
	if(other.seajs){
		response.write(seajs.header);
		response.write(template);
		response.write(seajs.footer);
	}else{
		response.write(template);
	}
	response.end();
};