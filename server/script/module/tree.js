var $ = require("lib/jquery.js"),
	base = require("$base.js"),
	object = require("$object.js"),
	Event = require("$event.js");

// 渲染文件树
function renderTree(node, data){
	node.innerHTML = (function(data, dir){
		data.files && data.files.sort(function(a, b){
			if(typeof a === "string" && typeof b === "string"){
				return a - b;
			}else if(typeof a === "string"){
				return -1;
			}else if(typeof b === "string"){
				return 1;
			}else{
				return a.dir - b.dir;
			}
		});
		if(typeof data === "string"){
			return '<a class="file" dir="' + dir + data + '">' + data + '</a>';
		}else{
			dir += data.dir + "/";
			var html = ['<div class="folder-open"><a class="folder-name">' + data.dir + '</a><div class="folder-content">'];
			for(var i = 0, l = data.files.length; i < l; i ++){
				html.push(arguments.callee(data.files[i], dir));
			}
			html.push('</div></div>');
			return html.join('');
		}
	})(data, "");
}

module.exports = object.extend(base.extend({
	node: null,
	init: function(opts){
		base.extend(this, opts);

		this.newEvent("fold");
		this.newEvent("select");

		this.bindEvents();
	},
	load: function(data){
		renderTree(this.node, data);
	},
	bindEvents: function(){
		var _this = this;
		// 绑定文件夹折叠事件
		$(this.node).delegate(".folder-name", "click", function(e){
			var node = e.target.parentNode;
			node.className = node.className === "folder-open" ? "folder-close" : "folder-open";
			_this.triggerEvent("fold");
		});
		// 选择文件
		$(this.node).delegate(".file", "click", function(e){
			$(".current", _this.node).removeClass("current");
			$(e.target).addClass("current");
			_this.triggerEvent("select", e.target.getAttribute("dir"));
		});
	}
}, Event));