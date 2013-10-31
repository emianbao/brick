var base = require("$base.js"),
	chtml = require("$chtml.js"),
	$ = require("lib/jquery.js"),
	ScrollBar = require("script/src/module/scrollbar.js");

var parseCode = {
	base: function(code){
		// 替换html实体
		code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return code;
	},
	js: function(code){
		var cache = [];

		code = this.base(code);

		code = code
			//.replace(/.+/g, function(a){
			//	return '<li>' + a + '</li>';
			//})
			// 注释
			.replace(/\/\*[\s\S]*?\*\/|(\:)?\/\/.*/g, function(a, b){
				return b === ":" ? a : "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			// 字符串
			.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(a){
				return "___cache" + (cache.push('<span class="string">' + a + "</span>") - 1) + "___"
			})
			// 正则
			.replace(/\/(?:\\\/|[^/\r\n])+\/(?=[^\/])/g, function(a){
				return "___cache" + (cache.push('<span class="regex">' + a + "</span>") - 1) + "___";
			})
			// 关键字
			.replace(/\b(function|var|return|break|new|for|if|else|while|this|in|typeof|undefined|null|Infinity|default|switch|case|arguments|window|document|location|Object|Array|Math|RegExp|String|Date|Number|Boolean|Function)\b/g, function(a){
				return "___cache" + (cache.push('<span class="keyword">' + a + "</span>") - 1) + "___"
			})
			// 结构
			.replace(/\{|\}|\(|\)|\[|\]/g, function(a){
				return "___cache" + (cache.push('<span class="struct">' + a + "</span>") - 1) + "___";
			})
			// 操作符
			.replace(/\+|\-|\*|\/|\=+|&lt;|&gt;|&|\||\!|%/g, function(a){
				return "___cache" + (cache.push('<span class="operator">' + a + "</span>") - 1) + "___";
			})
			// commonJS
			.replace(/\b(module\.exports|exports|require)\b/g, function(a){
				return "___cache" + (cache.push('<span class="commonjs">' + a + "</span>") - 1) + "___";
			})
			// 键
			.replace(/\s[\w\$\d]+\s?(?=:)/g, function(a){
				return /___cache(\d+)___/.test(a) ? a : "___cache" + (cache.push('<span class="key">' + a + "</span>") - 1) + "___";
			})
			// 操作符
			//.replace(/\.|;|,|\:|<|>|=+|\+=|\-=|\*=|\/=|%=|>=|<=|&|\||\!|\+|\-|\*|\/|%|\(|\)|\[|\]|\{|\}/g, function(a){
			//	return "___cache" + (cache.push('<span class="operator">' + a + "</span>") - 1) + "___";
			//});

		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			//.replace(/\r|\n/g, "");
		//code = '<ol>' + code + '</ol>';

		return code;
	},
	css: function(code){
		var cache = [];

		code = this.base(code);

		code = code
			// 注释
			.replace(/\/\*[\s\S]*?\*\//g, function(a){
				return "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			.replace(/\{[^\}]*?\}/g, function(a){
				return a
					// 颜色/数字/单位/url
					.replace(/#[0-9a-fA-F]{1,6}|\d+(px|%)|\b\d+\b|url\([^\)]*?\)/g, function(a){
						return "___cache" + (cache.push('<span class="unit">' + a + "</span>") - 1) + "___";
					})
					// 属性名
					.replace(/[\w\-]+\s?\:/g, function(a){
						if(/___cache(\d+)___/.test(a)){
							return a;
						}else{
							return "___cache" + (cache.push('<span class="keyword">' + a + "</span>") - 1) + "___";
						}
					});
			})
			.replace(/(^|\})[^\{]+?\{/g, function(a){
				return a
					// id选择器
					.replace(/#[\w\-]+/g, function(a){
						return "___cache" + (cache.push('<span class="id">' + a + "</span>") - 1) + "___";
					})
					// class选择器
					.replace(/\.[\w\-]+/g, function(a){
						return "___cache" + (cache.push('<span class="class">' + a + "</span>") - 1) + "___";
					})
					.replace(/\:[\w\-]+/g, function(a){
						return "___cache" + (cache.push('<span class="pseudo-class">' + a + "</span>") - 1) + "___";
					});
			})
			// 结构
			.replace(/\{|\}|\(|\)|\[|\]/g, function(a){
				return "___cache" + (cache.push('<span class="struct">' + a + "</span>") - 1) + "___";
			});

		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			});

		return code;
	},
	chtml: function(code){
		code = this.base(code);

		code = this.html(code);

		code = code
			.replace(/&lt;\$(js|css)=\s([\s\S]+?)\s\$&gt;/g, function(a, b, c){
				return '&lt;$<span class="require">' + b + '</span>= <span class="require">' + c + "</span> $&gt;"
			});

		return code;
	},
	tpl: function(code){
		var cache = [],
			jsCache = [];

		code = this.base(code);

		code = this.html(code);

		code = code
			.replace(/(&lt;\$=?)\s([\s\S]+?)\s(\$&gt;)/g, function(a, b, c, d){
				return "___cache" + (cache.push('<span class="tpl-tag">' + b + "</span>") - 1) + "___ ___jsCache" + (jsCache.push(c) - 1) + "___ ___cache" + (cache.push('<span class="tpl-tag">' + d + "</span>") - 1) + "___";
			});

		var _this = this;
		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			.replace(/___jsCache(\d+)___/g, function(a, b){
				return '<span class="js">' + _this.js(jsCache[b]) + "</span>";
			});

		return code;
	},
	html: function(code){
		var cache = [],
			cssCache = [],
			jsCache = [];

		code = this.base(code);

		code = code
			// 注释
			.replace(/&lt;\!\-\-[\s\S]*?\-\-&gt;/g, function(a){
				return "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			// 内嵌样式
			.replace(/(&lt;style[\s\S]*?type="text\/css"[\s\S]*?&gt;)([\s\S]*?)(&lt;\/style&gt;)/g, function(a, b, c, d){
				if(c){
					return b + '___cssCache' + (cssCache.push(c) - 1) + "___" + d;
				}else{
					return a;
				}
			})
			// 内嵌js
			.replace(/(&lt;script[\s\S]*?type="text\/javascript"[\s\S]*?&gt;)([\s\S]*?)(&lt;\/script&gt;)/g, function(a, b, c, d){
				if(c){
					return b + '___jsCache' + (jsCache.push(c) - 1) + "___" + d;
				}else{
					return a;
				}
			})
			// 属性
			.replace(/&lt;[^\$][\s\S]*?[^\$]&gt;/g, function(a){
				return a
					// 属性值
					.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(a){
						return "___cache" + (cache.push('<span class="attr-value">' + a + "</span>") - 1) + "___";
					})
					// 属性名
					.replace(/(\w+)=/g, function(a, b){
						return "___cache" + (cache.push('<span class="attr-name">' + b + "</span>") - 1) + "___=";
					});
			})
			// 标签
			.replace(/(&lt;\/?)(\w+)/g, function(a, b, c){
				return b + "___cache" + (cache.push('<span class="tag">' + c + "</span>") - 1) + "___";
			});

		var _this = this;
		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			.replace(/___cssCache(\d+)___/g, function(a, b){
				return '<span class="css">' + _this.css(cssCache[b]) + "</span>";
			})
			.replace(/___jsCache(\d+)___/g, function(a, b){
				return '<span class="js">' + _this.js(jsCache[b]) + "</span>";
			});

		return code;
	},
	txt: function(code){
		code = this.base(code);
		return code;
	}
};

module.exports = chtml.extend({
	init: function(opts){
		this._super(opts);

		this.scrollbar = new ScrollBar({
			box: this.nodes["code"],
			content: this.nodes["code-content"],
			scrollBarBox: this.nodes["scrollbar"],
			scrollBarBtn: this.nodes["scrollbar-btn"]
		});
	},
	view: function(code, ext){
		this.nodes["code-content"].className = ext;
		this.nodes["code-content"].innerHTML = code.length > 1000 * 200 ? parseCode.base(code) : parseCode[ext](code);
		this.nodes["code"].scrollTop = 0;
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});