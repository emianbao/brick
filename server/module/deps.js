// 解析模块依赖
var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
var SLASH_RE = /\\\\/g


var DIRNAME_RE = /[^?#]*\//
// Extract the directory portion of a path
// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
// ref: http://jsperf.com/regex-vs-split/2
function dirname(path) {
  return path.match(DIRNAME_RE)[0]
}

var DOT_RE = /\/\.\//g
var MULTIPLE_SLASH_RE = /([^:\/])\/\/+/g
var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//g

// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
function realpath(path) {
  // /a/b/./c/./d ==> /a/b/c/d
  path = path.replace(DOT_RE, "/")

  // "file:///a//b/c"  ==> "file:///a/b/c"
  // "http://a//b/c"   ==> "http://a/b/c"
  // "https://a//b/c"  ==> "https://a/b/c"
  // "/a/b//"          ==> "/a/b/"
  path = path.replace(MULTIPLE_SLASH_RE, "$1\/")

  // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, "/")
  }

  return path
}


function parsePath(currentDir, path){
	if(/^(\.){1,2}\//.test(path)){
		return {
			type: "absolute",
			path: realpath(currentDir + path)
		};
	}else if(/^\$/.test(path)){
		return {
			type: "base",
			path: path.replace(/^\$/, "")
		};
	}else{
		return {
			type: "relative",
			path: path
		};
	}
}


module.exports = {
	get: function(code, currentPath) {
		var currentDir = dirname(currentPath);

		var deps = [];

		code.replace(SLASH_RE, "")
			.replace(REQUIRE_RE, function(m, m1, m2) {
				if (m2) {
		    		deps.push(parsePath(currentDir, m2));
		    	}
			});

		return deps;
	},
	replace: function(code, depsStatus){
		return code.replace(SLASH_RE, "____ihezhu____")
			.replace(REQUIRE_RE, function(m, m1, m2) {
				if(m2){
		    		return m.replace(m2, depsStatus.shift());
				}else{
					return m;
				}
			})
			.replace(/____ihezhu____/g, "\\\\");
	}
};