var base = require("$base.js"),
	chtml = require("$chtml.js"),
	$ = require("lib/jquery.js"),
	ScrollBar = require("script/module/scrollbar.js");

var parseCode = {
	js: function(code){
		var cache = [];

		code = code
			// 注释
			.replace(/\/\*[\s\S]*?\*\/|(\:)?\/\/.*/g, function(a, b){
				return b === ":" ? a : "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			// 字符串
			.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(a){
				return "___cache" + (cache.push('<span class="string">' + a + "</span>") - 1) + "___"
			})
			// 关键字
			.replace(/\b(function|var|return|break|new|for|if|else|while|this)\b/g, function(a){
				return "___cache" + (cache.push('<span class="keyword">' + a + "</span>") - 1) + "___"
			})
			// 正则
			.replace(/\/(?:\\\/|[^/\r\n])+\/(?=[^\/])/g, function(a){
				return "___cache" + (cache.push('<span class="regex">' + a + "</span>") - 1) + "___";
			})
			// 操作符
			.replace(/\.|;|,|\:|<|>|=+|\+=|\-=|\*=|\/=|%=|>=|<=|&|\||\!|\+|\-|\*|\/|%|\(|\)|[|]|\{|\}/g, function(a){
				//return "___cache" + (cache.push('<span class="operator">' + a + "</span>") - 1) + "___";
				return a;
			});

		code = code.replace(/___cache(\d+)___/g, function(a, b){
			return cache[b];
		});

		return code;
	},
	css: function(code){
		// 注释
		code = code.replace(/\/\*[\s\S]*?\*\//g, function(a){
			return '<span class="comments">' + a + "</span>";
		});

		return code;
	},
	chtml: function(code){
		// 替换html实体
		code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return code;
	},
	tpl: function(code){
		// 替换html实体
		code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return code;
	},
	txt: function(code){
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
		this.nodes["code-content"].innerHTML = parseCode[ext](code);
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});