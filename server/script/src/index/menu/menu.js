var base = require("$base.js"),
	chtml = require("$chtml.js"),
	itemTemplate = require("./item.tpl"),
	$ = require("lib/jquery.js"),
	Selector = require("script/src/module/selector.js"),
	Radio = require("script/src/module/radio.js");

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
		this.newEvent("project", "memory");

		this.bindEvents();
	},
	loadProject: function(data){
		this.nodes["project-box"].innerHTML = itemTemplate(data);

		var radio = new Radio({
			items: $("a", this.nodes["project-box"]),
			className: "current"
		});
		if(radio.items.length > 0){
			$(radio.items[0]).click();
		}
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