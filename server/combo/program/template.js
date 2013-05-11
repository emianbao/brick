var fs = require("fs"),
	template = require("../../module/template.js");

module.exports = function(filename){
	var code = template.get(filename);
	return code || "";
};