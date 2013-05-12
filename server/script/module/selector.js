var $ = require("lib/jquery.js"),
	base = require("$base.js"),
	object = require("$object.js"),
	Event = require("$event.js");
	
$.fn.extend({
	// 是否包含node
	contains: document.compareDocumentPosition ? function(node){
			  return node === this[0] || this[0] == this[0].window || !!(this[0].compareDocumentPosition(node) & 16)
		  } : function(node){
			  return (this[0].contains ? this[0].contains(node) : true);
		  }
});

module.exports = object.extend(base.extend({
	target: null,
	viewBox: null,
	init: function(opts){
		base.extend(this, opts);
		this.newEvent("select");
		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		$(this.target)
			.mouseenter(function(){
				var pos = $(this).offset();
				_this.viewBox.style.left = pos.left + "px";
				_this.viewBox.style.top = pos.top + $(this).height() + 1 + "px";
				$(_this.viewBox).show();
				$(this).addClass("current");
			})
			.mouseleave(function(e){
				if(!$(_this.viewBox).contains(e.relatedTarget)){
					$(_this.viewBox).hide();
					$(this).removeClass("current");
				}
			});
		$(this.viewBox).mouseleave(function(e){
			if(!$(_this.target).contains(e.relatedTarget)){
				$(this).hide();
				$(_this.target).removeClass("current");
			}
		});

		$(this.viewBox).click(function(e){
			$(this).hide();
			$(_this.target).removeClass("current");
			_this.triggerEvent("select", e.target.getAttribute("value"));
		});
	}
}, Event));