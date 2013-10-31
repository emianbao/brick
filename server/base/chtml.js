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
	init: function(){},
	// 析构
	dispose: function(){
		// 移除节点
		var node = this.node,
			placeNode = this.placeNode,
			l;
		if(l = node.length){
			var parentNode = node[0].parentNode;
			for(var i = 1; i < l; i ++){
				parentNode.removeChild(node[i]);
			}
			if(placeNode){
				parentNode.replaceChild(placeNode, node[0]);
			}else{
				parentNode.removeChild(node[0]);
			}
		}
		this.node = null;
		this.placeNode = null;
		// 移除样式
		if(this.styleNode){
			this.styleNode.parentNode.removeChild(this.styleNode);
			this.styleNode = null;
		}
		return placeNode;
	},
	// 替换placeNode节点位置
	place: function(placeNode){
		var parentNode = placeNode.parentNode;
		for(var i = 0, l = this.node.length; i < l; i ++){
			parentNode.insertBefore(this.node[i], placeNode);
		}
		this.placeNode = parentNode.removeChild(placeNode);
		return this;
	},
	// 插入到parentNode内
	appendTo: function(parentNode){
		for(var i = 0, l = this.node.length; i < l; i ++){
			parentNode.appendChild(this.node[i]);
		}
		return this;
	},
	show: function(){
		base.each(this.node, function(node){
			node.style.display = "";
		});
	},
	hide: function(){
		base.each(this.node, function(node){
			node.style.display = "none";
		});
	}
}, Event));