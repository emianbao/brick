/**
 * 脚本压缩
 */
var uglify = require("./uglify/uglify-js"),
	jsp = uglify.parser,
	pro = uglify.uglify;
	
module.exports = function(code){
    var ast = jsp.parse(code);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
         
    return pro.gen_code(ast);
};