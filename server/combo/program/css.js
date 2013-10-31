var fs = require("fs"),
	cleanCSS = require("clean-css");

module.exports = function(filename){
	if(fs.existsSync(filename)){
		var code = fs.readFileSync(filename, 'utf8');
		return 'module.exports = "' + cleanCSS.process(code).replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + '"';
	}
	return null;
};