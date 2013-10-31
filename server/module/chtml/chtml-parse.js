var fs = require("fs"),
	template = require("../template-parse.js"),
	templateTrans = require("../template.js"),
	config = require("../../config.js");

module.exports = function(url){
	if(fs.existsSync(url)){
		var code = fs.readFileSync(url, 'utf8'),
			tpl1 = fs.readFileSync(config.root + "/module/chtml/chtml.tpl", "utf8"),
			tpl2 = fs.readFileSync(config.root + "/module/chtml/chtml2.tpl", "utf8"),
			js,
			css,
			cssTitle;
		code = code.replace(/<\$js= ([\s\S]*?) \$>/, function(a, b){
			js = b;
			return "";
		}).replace(/<\$css= ([\s\S]*?) \$>/, function(a, b){
			css = b;
			return "";
		}).replace(/<\$css-title= ([\s\S]*?) \$>/, function(a, b){
			cssTitle = b;
			return "";
		});
		code = code.replace(/^\s+|\s+$/g, "").replace(/>\s+</g, "><");
		if(code){
			return template.replace(tpl1, {
				js: js,
				css: css,
				cssTitle: cssTitle,
				html: templateTrans.toFn(code.replace(/\r\n/g, "").replace(/\\/g, "\\\\").replace(/'/g, "\\'"))
			});
		}else{
			return template.replace(tpl2, {
				js: js,
				css: css,
				cssTitle: cssTitle
			});
		}
	}
	return "";
};