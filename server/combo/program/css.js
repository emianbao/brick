var fs = require("fs");

module.exports = function(filename){
	if(fs.existsSync(filename)){
		var code = fs.readFileSync(filename, 'utf8');
		return 'module.exports = "' + code.replace(/\s+/g, " ") + '"';
	}
	return null;
};