var base = require("$base.js"),
	chtml = require("$chtml.js"),
	itemTemplate = require("./item.tpl"),
	$ = require("lib/jquery.js"),
	Selector = require("script/module/selector.js"),
	Radio = require("script/module/radio.js");

module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);
		this.file = new Selector({
			target: this.nodes["file"],
			viewBox: this.nodes["file-box"]
		});
		this.project = new Selector({
			target: this.nodes["project"],
			viewBox: this.nodes["project-box"]
		});

		this.newEvent("file");
		this.newEvent("project");

		this.bindEvents();
	},
	loadProject: function(data){
		this.nodes["project-box"].innerHTML = itemTemplate(data);

		new Radio({
			items: $("a", this.nodes["project-box"]),
			className: "current"
		});
	},
	bindEvents: function(){
		var _this = this;
		this.file.addEvent("select", function(value){
			_this.triggerEvent("file", value);
		});
		this.project.addEvent("select", function(value){
			_this.triggerEvent("project", value);
		});
	}
});