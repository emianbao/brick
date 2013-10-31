/**
 * 自定义滚动条
 */
var $ = require("lib/jquery.js");
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


		var mousedown = false,
			offsetTop,
			maxTop;
		$(this.scrollBarBtn).mousedown(function(e){
			mousedown = true;
			offsetTop = this.offsetTop - e.pageY;
			maxTop = _this.scrollBarBox.offsetHeight - this.offsetHeight;

			$(document.body).addClass("no-select");
		});
		$(document).mousemove(function(e){
			if(mousedown){
				var top = offsetTop + e.pageY;
				if(top < 0)
					top = 0;
				if(top > maxTop)
					top = maxTop;
				_this.scrollBarBtn.style.top = top + "px";
				_this.refreshContentTop();
			}
		});
		$(document).mouseup(function(e){
			if(mousedown){
				mousedown = false;

				$(document.body).removeClass("no-select");
			}
		});
	},
	refreshHeight: function(){
		var boxHeight = this.box.offsetHeight,
			contentHeight = this.content.offsetHeight;
		if(contentHeight > boxHeight){
			this.scrollBarBox.style.display = "";
			var scrollBarBoxHeight = this.scrollBarBox.offsetHeight;
			this.scrollBarBtn.style.height = Math.max(this.minHeight, boxHeight * scrollBarBoxHeight / contentHeight) + "px";
			this.zoom = scrollBarBoxHeight / contentHeight;
		}else{
			this.scrollBarBox.style.display = "none";
			this.zoom = 1;
		}
	},
	refreshTop: function(){
		if(this.zoom < 1){
			this.scrollBarBtn.style.top = this.box.scrollTop * this.zoom + "px";
		}
	},
	refreshContentTop: function(){
		if(this.zoom < 1){
			this.box.scrollTop = this.scrollBarBtn.offsetTop / this.zoom;
		}
	}
};

module.exports = ScrollBar;