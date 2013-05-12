var base = require("$base.js"),
	chtml = require("$chtml.js"),
	$ = require("lib/jquery.js"),
	Tree = require("script/module/tree.js"),
	ScrollBar = require("script/module/scrollbar.js");

module.exports = chtml.extend({
	init: function(opts){
		this._super(opts);

		this.tree = new Tree({
			node: this.nodes["tree-content"]
		});
		this.scrollbar = new ScrollBar({
			box: this.nodes["tree"],
			content: this.nodes["tree-content"],
			scrollBarBox: this.nodes["scrollbar"],
			scrollBarBtn: this.nodes["scrollbar-btn"]
		});

		this.newEvent("select");

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		this.tree.addEvent("fold", function(){
			_this.scrollbar.refreshHeight();
		});
		this.tree.addEvent("select", function(file){
			_this.triggerEvent("select", file);
		});
	},
	load: function(data){
		this.tree.load(data);
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});