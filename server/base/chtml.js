var object = require("./object.js"),
	base = require("./base.js"),
	Event = require("./event.js");

module.exports = object.extend(base.extend({
	// 模块节点列表
	node: [],
	// 模块样式节点
	styleNode: null,
	// 占位节点
	placeNode: null,
	init: function(opts){
		base.extend(this, opts);
	},
	dispose: function(){
		// 移除节点
		var node = this.node,
			l;
		if(l = node.length){
			var parentNode = node[0].parentNode;
			for(var i = 1; i < l; i ++){
				parentNode.removeChild(node[i]);
			}
			parentNode.replaceChild(this.placeNode, node[0]);
		}
		this.node = null;
		// 移除样式
		if(this.styleNode){
			this.styleNode.parentNode.removeChild(this.styleNode);
			this.styleNode = null;
		}
		return this.placeNode;
	}
}, Event));