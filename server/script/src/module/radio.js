var $ = require("lib/jquery.js"),
	base = require("$base.js"),
	object = require("$object.js"),
	Event = require("$event.js");

module.exports = object.extend(base.extend({
	// jQuery
	items: [],
	// string
	className: "",
	selectedIndex: -1,
	init: function(opts){
		opts = base.extend(this, opts);
		this.newEvent("change");
		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		this.items.each(function(index, node){
			$(node).click(function(){
				_this.select(index);
			});
		});
	},
	select: function(index){
		this.items.eq(this.selectedIndex).removeClass(this.className);
		this.items.eq(index).addClass(this.className);
		this.selectedIndex = index;
		this.triggerEvent("change");
	},
	get: function(){
		return this.items.eq(this.selectedIndex)[0];
	}
}, Event));