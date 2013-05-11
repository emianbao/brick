var fs = require("fs"),
	chtmlParse = require("../../module/chtml/chtml-parse.js");

module.exports = function(filename){
	var code = chtmlParse(filename);
	return code || "";
};