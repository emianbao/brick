var fs = require("fs"),
	template = require("../template-parse.js");

module.exports = function(url){
	if(fs.existsSync(url)){
		var code = fs.readFileSync(url, 'utf8'),
			tpl = fs.readFileSync("./module/chtml/chtml.tpl", "utf8"),
			js,
			css;
		code = code.replace(/<\$js= ([\s\S]*?) \$>/, function(a, b){
			js = b;
			return "";
		}).replace(/<\$css= ([\s\S]*?) \$>/, function(a, b){
			css = b;
			return "";
		});
		code = code.replace(/^\s+|\s+$/g, "").replace(/>\s+</g, "><");
		return template.replace(tpl, {
			js: js,
			css: css,
			html: code
		});
	}
	return "";
};