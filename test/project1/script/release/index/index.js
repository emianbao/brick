(function(){
	var modules = {},
		require = function(uri){
			return modules[uri]
		},
		module = {
			exports:{}
		};
modules['3'] = (function(){
	var exports = module.exports = {};
module.exports = {
	// 扩展对象
	extend: function (target, src, complete) {
        if (typeof src === "undefined") {
            src = target;
            target = this;
        }
        for (var s in src){
			if(complete){
				if (typeof src[s] !== "undefined")
					target[s] = src[s];
			}else{
				if (src.hasOwnProperty(s) && typeof src[s] !== "undefined")
					target[s] = src[s];
			}
		}
        return target;
    },
	parseNode: function(node){
		var i,
			l,
			nodes = {};

		if(node instanceof Array){
			var self = arguments.callee;
			for(i = 0, l = node.length; i < l; i ++){
				this.extend(nodes, self(node[i]));
			}
		}else{
			var _nodes = node.getElementsByTagName("*"),
				marker;
			if(marker = node.getAttribute("marker")){
				nodes[marker] = node;
			}
			for(var i = 0, l = _nodes.length; i < l; i ++){
				if(marker = _nodes[i].getAttribute("marker")){
					nodes[marker] = _nodes[i];
				}
			}
		}
		return nodes;
	},
	toNode: function(str){
        var div = document.createElement("div"),
            documentFragment = document.createDocumentFragment();
        div.innerHTML = str;
        var childNodes = div.childNodes;
        for(var i = 0, l = childNodes.length; i < l; i ++){
            documentFragment.appendChild(childNodes[0]);
        }
        div = null;
        return documentFragment;
	},
	document: function(node){
		return node.document || (node.nodeType === 9 ? node : node.ownerDocument);
	},
	window: function(node){
		var doc = this.document(node);
		return doc ? (doc.defaultView || doc.parentWindow) : null;
	}
};
	return module.exports;
})();
modules['6'] = (function(){
	var exports = module.exports = {};
// 对象继承基类
module.exports = (function () {
    var initializing = false,
        fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

    var Class = function () { };
    //类扩展
    Class.extend = function (prop) {
        var _super = this.prototype;

        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] === "function" &&
            typeof _super[name] === "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        function Class() {
            if (!initializing && this.init) {
                var result = this.init.apply(this, arguments);
                if (typeof result !== "undefined")
                    return result;
            }
        }

        Class.prototype = prototype;
        Class.constructor = Class;
        Class.extend = arguments.callee;

        return Class;
    };

    return Class;
})();
	return module.exports;
})();
modules['7'] = (function(){
	var exports = module.exports = {};
/**
	事件特性：

	记忆(memroy)：
		先触发事件，后绑定事件
		场景：domready、地图连续滚动滚轮
	记忆最后一次(memoryLast)：
		先触发事件，后绑定事件，只处理最后一次触发操作
		场景：城市切换
	只能触发一次(once)：
		场景：domready
	遇到返回值为false，停止之后的处理程序(stopOnFalse):
		场景：一系列表单验证
	触发后清空之前绑定(clear):
		场景：
	返回值列表(results):
		场景：submit
	处理程序排序(level):
		让后绑定的处理程序先执行
		场景：
	异步处理(async):
		事件出发后，程序异步执行
		场景：界面显示、大计算操作
	异步处理之前的最后一次触发(onlyLast):
		场景：调整界面渲染
	执行环境(context):
		切换处理程序执行环境（this值）
		场景：DOM事件绑定
*/

var flagsCache = {};

/*
	flags:
		memory
		memoryLast
		once
		clear
		stopOnFalse
		sort
*/
function createFlags(flags) {
    var object = flagsCache[flags] = {},
        i, l;
    flags = flags.split(/\s+/);
    for (i = 0, l = flags.length; i < l; i++) {
        object[flags[i]] = true;
    }
    return object;
}

// 检测事件数据存放包是否初始化
function checkEventPackage(){
	if(!this.eventPackage){
		this.eventPackage = {
			// 执行环境
			context: this,
			// 事件
			events: {},
			// 事件句柄
			handler: 0,
			// 事件句柄缓存
			handlerCache: {},
			// 事件特性
			flags: {},
			// 单次执行事件执行状态
			onceRun: {},
			// 记忆事件执行记录
			memoryCache: {}
		};
	}
}

function sort(list){
	list.sort(function(fn1, fn2){
		return fn2.level - fn1.level;
	});
}

// 触发事件（内部）
// 返回执行结果数组
function triggerEvent(eventName, argus){
	var eventPackage = this.eventPackage,
		fns = eventPackage.events[eventName],
		context = eventPackage.context,
		results = [],
		i, l;
	if(fns){
		if(eventPackage.flags[eventName]["stopOnFalse"]){
			for(i = 0, l = fns.length; i < l; i ++){
				// 遇到返回值为false的，停止执行后续处理
				if((results[i] = fns[i].apply(context, argus)) === false){
					break;
				}
			}
		}else{
			for(i = 0, l = fns.length; i < l; i ++){
				results[i] = fns[i].apply(context, argus);
			}
		}
	}
	return results;
}

module.exports = {
	// 设置事件处理环境
	setEventContext: function(context){
		checkEventPackage.call(this);
		
		this.eventPackage.context = context;
	},
	/**
		新建事件
	*/
	newEvent: function(eventName, flags){
		checkEventPackage.call(this);

		var eventPackage = this.eventPackage;
		// 设置事件特性
		eventPackage.flags[eventName] = flags = flags ? (flagsCache[flags] || createFlags(flags)) : {};
		// 初始化单次执行状态
		if(flags["once"]){
			eventPackage.onceRun[eventName] = true;
		}
		// 初始化记忆缓存
		if(flags["memoryLast"] || flags["memory"]){
			eventPackage.memoryCache[eventName] = [];
		}
	},
	/** 添加事件
		eventName  事件名
		fn  事件处理函数
		level  事件执行顺序 level值越大越优先执行
	*/
	addEvent: function(eventName, fn, level){
		fn.level = level || 0;

		var eventPackage = this.eventPackage,
			events = eventPackage.events,
			flags = eventPackage.flags[eventName],
			context = eventPackage.context;

		(events[eventName] || (events[eventName] = [])).push(fn);
		if(flags["sort"]){
			fn.level = level || 0;
			sort(events[eventName]);
		}

		if(flags["memoryLast"] || flags["memory"]){
			var memoryCache = eventPackage.memoryCache[eventName];

			for(var i = 0, l = memoryCache.length; i < l; i ++){
				fn.apply(context, memoryCache[i]);
			}
		}

		eventPackage.handlerCache[++ eventPackage.handler] = [eventName, fn];
		return eventPackage.handler;
	},
	/** 添加异步事件
		onlyLast 异步处理函数执行时，只执行之前最后一次事件触发
	*/
	addEventAsync: function(eventName, fn, onlyLast, level){
		// 异步事件处理程序
		var cache = this.eventPackage.handlerCache,
			handler;

		return handler = this.addEvent(eventName, function(){
			var cacheHandler = cache[handler];
			if(onlyLast && cacheHandler.asyncHandler){
				clearTimeout(cacheHandler.asyncHandler);
			}
			var argus = arguments,
				_this = this,
				result = {
					type: "asyncResult",
					value: null,
					list: [],
					get: function(fn){
						if(this.list){
							this.list.push(fn);
						}else{
							fn(this.value);
						}
					},
					set: function(value){
						this.value = value;
						for(var i = 0, l = this.list.length; i < l; i ++){
							this.list[i](value);
						}
						delete this.list;
					}
				};
			cacheHandler.asyncHandler = setTimeout(function(){
				delete cacheHandler.asyncHandler;
				result.set(fn.apply(_this, argus));
			}, 1);
			return result;
		}, level);
	},
	/** 移除事件
		1、number  移除事件句柄等于number的事件
		2、string function  移除事件名等于string和处理函数等于function的事件
		3、string  移除事件名等于string的所有事件
		4、undefined  移除所有事件
	*/
	removeEvent: function(){
		var eventPackage;
		
        if (!(eventPackage = this.eventPackage)){
        	return false;
        }

        var events = eventPackage.events,
        	cache = eventPackage.handlerCache,
        	argus0 = arguments[0],
        	argus0type = typeof argus0,
        	argus1 = arguments[1],
        	argus1type = typeof argus1;

        var i, l, key, fns;
        // 通过事件绑定句柄移除事件
        if (argus0type === "number") {
            if(cache[argus0]){
            	arguments.callee.apply(this, cache[argus0]);
            }
        }
        // 通过事件名和处理函数移除事件
        else if (argus0type === "string" && argus1type === "function") {
            fns = events[argus0];
            for(i = 0, l = fns.length; i < l; i ++){
            	if(argus1 === fns[i]){
            		fns.splice(i, 1);
            		break;
            	}
            }
            // 移除句柄缓存
            for(key in cache){
            	if(argus0 === cache[key][0] && argus1 === cache[key][1]){
            		delete cache[key];
            		break;
            	}
            }
        }
        // 移除事件名等于eventName的所有事件
        else if (argus0type === "string" && argus1type === "undefined") {
            events[argus0] = [];
            // 移除句柄缓存
            for(key in cache){
            	if(argus0 === cache[key][0]){
            		delete cache[key];
            	}
            }
            // 移除触发记录（由于移除整个事件情况比较少，事件状态占用内存比较少，所以其他事件状态不做移除，只移除内存占用较多的触发记录）
            var flags = eventPackage.flags[argus0];
            if(flags["memory"] || flags["memoryLast"]){
            	delete eventPackage.memoryCache[argus0];
            }
        }
        // 移除所有事件
        else if (argus0type === "undefined") {
            eventPackage.events = {};
            // 移除句柄缓存
            eventPackage.cache = {};
            // 移除事件特性
            //eventPackage.flags = {};
            // 移除触发记录
            //eventPackage.memoryCache = {};
        }
	},
	// 触发事件
	// 返回执行结果数组
	triggerEvent: function(eventName){
		var argus = Array.prototype.slice.call(arguments, 1),
			run = true,
			eventPackage = this.eventPackage,
			flags = eventPackage.flags[eventName];

		if(flags["once"]){
			if(eventPackage.onceRun[eventName]){
				delete eventPackage.onceRun[eventName];
			
				if(flags["memoryLast"] || flags["memory"]){
					eventPackage.memoryCache[eventName] = [argus];
				}
			}else{
				run = false;
			}
		}else{
			if(flags["memoryLast"]){
				eventPackage.memoryCache[eventName] = [argus];
			}else if(flags["memory"]){
				eventPackage.memoryCache[eventName].push(argus);
			}
		}

		var result = [];
		if(run){
			result = triggerEvent.call(this, eventName, argus);
		}


		if(flags["clear"]){
			this.removeEvent(eventName);
		}

		return result;
	}
};

	return module.exports;
})();
modules['5'] = (function(){
	var exports = module.exports = {};
var object = require("6"),
	base = require("3"),
	Event = require("7");

module.exports = object.extend(base.extend({
	// 模块节点列表
	node: [],
	// 模块样式节点
	styleNode: null,
	// 占位节点
	placeNode: null,
	init: function(opts){
		base.extend(this, opts);
	},
	dispose: function(){
		// 移除节点
		var node = this.node,
			l;
		if(l = node.length){
			var parentNode = node[0].parentNode;
			for(var i = 1; i < l; i ++){
				parentNode.removeChild(node[i]);
			}
			parentNode.replaceChild(this.placeNode, node[0]);
		}
		this.node = null;
		// 移除样式
		if(this.styleNode){
			this.styleNode.parentNode.removeChild(this.styleNode);
			this.styleNode = null;
		}
		return this.placeNode;
	}
}, Event));
	return module.exports;
})();
modules['4'] = (function(){
	var exports = module.exports = {};
var base = require("3"),
	chtml = require("5");

module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);
	}
});
	return module.exports;
})();
modules['8'] = (function(){
	var exports = module.exports = {};
module.exports = ".filter{ line-height: 30px; height: 30px; padding: 0 100px; background-color: #eee; } .filter a{ float: left; padding: 0 20px; }"
	return module.exports;
})();
modules['2'] = (function(){
	var exports = module.exports = {};
var base = require("3");

var js = require("4");

var css = require("8");

module.exports = function(placeNode){
	var styleNode;
	
		var doc = base.document(placeNode);
		styleNode = doc.createElement("style");
		styleNode.type = "text/css";
		styleNode.innerHTML = css;
		(doc.head || doc.getElementsByTagName("head")[0]).appendChild(styleNode);
	

	var node = base.toNode('<div class="filter"><a marker=\'price\'>价格</a><a marker="type">房型</a></div>'),
		_childNodes = node.childNodes,
		childNodes = [];
	for(var i = 0, l = _childNodes.length; i < l; i ++){
		childNodes[i] = _childNodes[i];
	}
	placeNode.parentNode.replaceChild(node, placeNode);

	return new js({
		node: childNodes,
		styleNode: styleNode,
		placeNode: placeNode,
		nodes: base.parseNode(childNodes)
	});
};
	return module.exports;
})();
modules['11'] = (function(){
	var exports = module.exports = {};
module.exports = function(GlobalData){var __result__ = [];__result__.push("<ul>"); for(var i = 0, l = GlobalData.length; i < l; i ++){ __result__.push("<li>"); __result__.push(GlobalData[i]); __result__.push("</li>"); } __result__.push("</ul>");return __result__.join('');}
	return module.exports;
})();
modules['10'] = (function(){
	var exports = module.exports = {};
var base = require("3"),
	chtml = require("5"),
	listTemplate = require("11");

module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);
	},
	view: function(data){
		this.nodes["list"].innerHTML = listTemplate(data);
	}
});
	return module.exports;
})();
modules['12'] = (function(){
	var exports = module.exports = {};
module.exports = ".list{ padding: 50px 100px; } .list li{ list-style: none; line-height: 30px; border-bottom:1px dotted #ddd; }"
	return module.exports;
})();
modules['9'] = (function(){
	var exports = module.exports = {};
var base = require("3");

var js = require("10");

var css = require("12");

module.exports = function(placeNode){
	var styleNode;
	
		var doc = base.document(placeNode);
		styleNode = doc.createElement("style");
		styleNode.type = "text/css";
		styleNode.innerHTML = css;
		(doc.head || doc.getElementsByTagName("head")[0]).appendChild(styleNode);
	

	var node = base.toNode('<div class="list" marker="list"></div>'),
		_childNodes = node.childNodes,
		childNodes = [];
	for(var i = 0, l = _childNodes.length; i < l; i ++){
		childNodes[i] = _childNodes[i];
	}
	placeNode.parentNode.replaceChild(node, placeNode);

	return new js({
		node: childNodes,
		styleNode: styleNode,
		placeNode: placeNode,
		nodes: base.parseNode(childNodes)
	});
};
	return module.exports;
})();
modules['1'] = (function(){
	var exports = module.exports = {};
var //$			= require("module/jquery.js"),
	filterMod	= require("2"),
	listMod		= require("9");

filterMod = filterMod(document.getElementById("filter"));
listMod = listMod(document.getElementById("list"));

listMod.view([1,2,3,4,5,6,7,8,9,10]);
	return module.exports;
})();
	Fan.modules = modules;
})()