var base = require("$base.js"),
	chtml = require("$chtml.js"),
	$ = require("lib/jquery.js"),
	ScrollBar = require("script/src/module/scrollbar.js"),
	template = require("./template.tpl");

module.exports = chtml.extend({
	init: function(opts){
		this._super(opts);

		this.scrollbar = new ScrollBar({
			box: this.nodes["file-list"],
			content: this.nodes["file-list-content"],
			scrollBarBox: this.nodes["scrollbar"],
			scrollBarBtn: this.nodes["scrollbar-btn"]
		});
	},
	view: function(result){
		this.nodes["file-list-content"].innerHTML = template(result);
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});