var base = require("$base.js"),
	chtml = require("$chtml.js"),
	$ = require("lib/jquery.js"),
	Radio = require("script/src/module/radio.js");
module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);

		this.radio = new Radio({
			items: $("a", this.nodes["box"]),
			className: "current"
		});

		this.newEvent("change", "memory");

		this.bindEvents();

		this.radio.select(0);
	},
	bindEvents: function(){
		var _this = this;
		this.radio.addEvent("change", function(){
			var value = this.get().getAttribute("value");
			_this.triggerEvent("change", value);
		});
	}
});