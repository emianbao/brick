/**
 * 自定义滚动条
 */
var $ = require("../lib/jquery");
function ScrollBar(opts){
	this.init(opts);
}

ScrollBar.prototype = {
	init: function(opts){
		opts = $.extend({
			box: null,
			content: null,
			scrollBarBox: null,
			scrollBarBtn: null,
			minHeight: 10,
			scrollUnit: 50
		}, opts);
		this.setOptions(opts);
		this.bindEvents();
		this.refreshHeight();
		this.refreshTop();
	},
	setOptions: function(opts){
		$.extend(this, opts);
		$.extend(this, {
			zoom: 1
		});
	},
	bindEvents: function(){
		var _this = this;
		function MouseWheelHandler(e){
			e = e || window.event;
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			//console.log(delta);
			_this.box.scrollTop -= delta * _this.scrollUnit;
			_this.refreshTop();
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue = false;
			}
		}
		if(this.box.addEventListener){
			this.box.addEventListener("mousewheel", MouseWheelHandler, false);
			this.box.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}else if(this.box.attachEvent){
			this.box.attachEvent("onmousewheel", MouseWheelHandler);
		}else{
			this.box.onmousewheel = MouseWheelHandler;
		}

		$(window).bind("resize", function(){
			_this.refreshHeight();
			_this.refreshTop();
		});
	},
	refreshHeight: function(){
		var boxHeight = this.box.offsetHeight,
			contentHeight = this.content.offsetHeight;
		if(contentHeight > boxHeight){
			var scrollBarBoxHeight = this.scrollBarBox.offsetHeight;
			this.scrollBarBtn.style.height = Math.max(this.minHeight, boxHeight * scrollBarBoxHeight / contentHeight) + "px";
			this.scrollBarBtn.style.display = "";
			this.zoom = scrollBarBoxHeight / contentHeight;
		}else{
			this.scrollBarBtn.style.display = "none";
			this.zoom = 1;
		}
	},
	refreshTop: function(){
		if(this.zoom < 1){
			this.scrollBarBtn.style.top = this.box.scrollTop * this.zoom + "px";
		}
	}
};

module.exports = ScrollBar;