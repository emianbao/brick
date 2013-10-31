(function(){
	var modules = {},
		require = function(uri){
			return modules[uri]
		},
		module = {
			exports:{}
		};
modules['4'] = (function(){
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
modules['7'] = (function(){
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
modules['8'] = (function(){
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
modules['6'] = (function(){
	var exports = module.exports = {};
var object = require("7"),
	base = require("4"),
	Event = require("8");

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
modules['9'] = (function(){
	var exports = module.exports = {};
module.exports = function(GlobalData){var __result__ = []; for(var i = 0, l = GlobalData.length, item; i < l; i ++){	item = GlobalData[i];__result__.push("<a value=\""); __result__.push(item); __result__.push("\">"); __result__.push(item); __result__.push("</a>"); } return __result__.join('');}
	return module.exports;
})();
modules['5'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	itemTemplate = require("9"),
	$ = require("2"),
	Selector = require("10"),
	Radio = require("11");

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
	return module.exports;
})();
modules['12'] = (function(){
	var exports = module.exports = {};
module.exports = ".menu{ height: 30px; line-height: 30px; background-color:#eee; background:-webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(#eee)); border-bottom:1px solid #ddd; padding: 0 20px; } .menu a{ float: left; line-height: 30px; padding: 0 20px; color: #333; cursor: pointer; } .menu a:hover, .menu .current{ background-color:#fff; padding: 0 19px; border:1px solid #ddd; border-width: 0 1px; border-bottom:1px solid #fff; } .menu-item{ position: absolute; border:1px solid #ddd; border-top-width: 0; background-color: #fff; z-index: 5000; } .menu-item a{ display: block; line-height: 30px; width: 100px; padding-left: 10px; cursor: pointer; } .menu-item a:hover{ background-color:#f6f6f6; } .menu-item a.current{ color: #f90; background-color: #fff; }"
	return module.exports;
})();
modules['3'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("5");

var css = require("12");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="menu"><a marker="file">文件</a><a marker="project">项目</a></div><div class="menu-item" marker="file-box" style="display:none;"><a value="add">添加项目</a><a value="new">新建项目</a></div><div class="menu-item" marker="project-box" style="display:none;"></div>'),
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
modules['14'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	$ = require("2"),
	Radio = require("11");
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
	return module.exports;
})();
modules['15'] = (function(){
	var exports = module.exports = {};
module.exports = ".nav{ height: 30px; line-height: 30px; background-color:#fafafa; border-bottom:1px solid #ddd; padding: 0 20px; } .nav a{ float: left; font:14px/30px 微软雅黑; padding: 0 30px; color: #333; cursor: pointer; } .nav a:hover{ background-color: #ddd; } .nav a.current{ /*background-color:#333; color: #fff;*/ background-color: #fafafa; color: #f90; cursor: default; }"
	return module.exports;
})();
modules['13'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("14");

var css = require("15");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div marker="box" class="nav"><a value="combo">合并压缩</a><a value="deps">依赖查看</a><a value="view-file">文件浏览</a><a value="unit-test">单元测试</a></div>'),
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
modules['18'] = (function(){
	var exports = module.exports = {};
var chtml = require("6");

module.exports = chtml.extend({
	loadProject: function(projectName){}
});
	return module.exports;
})();
modules['20'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	$ = require("2"),
	Tree = require("21"),
	ScrollBar = require("22");

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
	return module.exports;
})();
modules['23'] = (function(){
	var exports = module.exports = {};
module.exports = ".nav-tree{ position: absolute; left: 0; top: 0; height:100%; width: 300px; overflow: hidden; background-color: #fff; color: #333; } .nav-tree .tree{ height: 100%; overflow: hidden; } .nav-tree .tree-content{ padding: 10px; } .nav-tree .scrollbar{ position:absolute; top:0; right:0; width:8px; height:100%; background-color:#eee; } .nav-tree .scrollbar-btn{ position:absolute; left:0; top:0px; width:8px; height:100px; background-color:#999; border-radius:4px; } .nav-tree .file{background-image: url(/pic/file-333.png);} .nav-tree .folder-content{border-color: #ddd} .nav-tree .folder-open .folder-name{ background-image: url(/pic/close-333.png); } .nav-tree .folder-close .folder-name{ background-image: url(/pic/open-333.png); } .nav-tree .folder-name:hover, .nav-tree .file:hover{background-color: #eee;} .nav-tree .current{background: url(/pic/file-checked.png) no-repeat 10px 50%;color: #f90;cursor: default;} .nav-tree .current:hover{background-color: #fff;}"
	return module.exports;
})();
modules['19'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("20");

var css = require("23");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="nav-tree"><div marker="tree" class="tree"><div marker="tree-content" class="tree-content"></div></div><div marker="scrollbar" class="scrollbar"><div marker="scrollbar-btn" class="scrollbar-btn"></div></div></div>'),
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
modules['26'] = (function(){
	var exports = module.exports = {};
module.exports = function(GlobalData){var __result__ = []; for(var i = 0, l = GlobalData.length; i < l; i ++){ __result__.push("<a class=\"file\">"); __result__.push(GlobalData[i]); __result__.push("</a>"); } return __result__.join('');}
	return module.exports;
})();
modules['25'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	$ = require("2"),
	ScrollBar = require("22"),
	fileListTemplate = require("26");

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
	view: function(files){
		this.nodes["file-list-content"].innerHTML = fileListTemplate(files);
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});
	return module.exports;
})();
modules['27'] = (function(){
	var exports = module.exports = {};
module.exports = ".combo-list{ position: absolute; left: 300px; top: 0; right: 0; height: 100%; } .combo-list .file-list{ height: 100%; overflow: hidden; } .combo-list .file-list-content{ padding: 10px; } .combo-list .scrollbar{ position:absolute; top:0; right:0; width:8px; height:100%; background-color:#444; } .combo-list .scrollbar-btn{ position:absolute; left:0; top:0px; width:8px; background-color:#999; border-radius:4px; } .combo-list .file{ background-image: url(/pic/file-999.png); color: #ccc; } .combo-list .file:hover{ background-color: #222; }"
	return module.exports;
})();
modules['24'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("25");

var css = require("27");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="combo-list"><div marker="file-list" class="file-list"><div marker="file-list-content" class="file-list-content"></div></div><div marker="scrollbar" class="scrollbar"><div marker="scrollbar-btn" class="scrollbar-btn"></div></div></div>'),
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
modules['17'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	content = require("18"),
	$ = require("2"),
	releaseTree = require("19"),
	comboList = require("24");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.releaseTree = releaseTree(this.nodes["release-tree"]);
		this.comboList = comboList(this.nodes["combo-list"]);
		this.comboConfig = {};
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.releaseTree.addEvent("select", function(file){
			file = file.replace(/^release\//, "");
			var comboFiles = _this.comboConfig[file];
			if(comboFiles){
				_this.currentFile = file;
				_this.comboList.view(comboFiles);
			}
		});
		// 压缩选中文件
		$(this.nodes["combo"]).click(function(){
			if(_this.projectName && _this.currentFile){
				$.ajax({
					url: "/ajax/combo.ihezhu",
					type: "POST",
					data: {
						projectName: _this.projectName,
						file: _this.currentFile,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						console.log(result);
					}
				});
			}
		});
		// 压缩当前项目所有文件
		$(this.nodes["combo-all"]).click(function(){
			if(_this.projectName){
				$.ajax({
					url: "/ajax/combo.ihezhu",
					type: "POST",
					data: {
						projectName: _this.projectName,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求发布目录
		$.ajax({
			url: "/ajax/releaseFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.releaseTree.load(files);
			}
		});
		// 请求合并配置
		$.ajax({
			url: "/ajax/combo-config.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(comboConfig){
				_this.comboConfig = comboConfig;
			}
		});
	}
});
	return module.exports;
})();
modules['28'] = (function(){
	var exports = module.exports = {};
module.exports = ".combo{ position: absolute; width: 100%; top:62px; bottom: 61px; } .combo .tool{ position: absolute; height: 30px; padding: 15px 20px; left: 0; right: 0; bottom: -61px; border-top:1px solid #fff; background-color: #333; text-align: right; } .button{ display:inline-block; height:30px; padding: 0 30px; font:14px/30px 微软雅黑; color:#fff; background-color: #8ac340; background:-webkit-gradient(linear, 0 0, 0 100%, from(#8ac340), to(#71a735)); background:-moz-linear-gradient(top, #8ac340, #71a735); border-color:#8ac340; border-radius:5px; cursor:pointer; margin-right: 10px; } .button:hover{ background-color: #f90; background:-webkit-gradient(linear, 0 0, 0 100%, from(#f90), to(#da8302)); background:-moz-linear-gradient(top, #f90, #da8302); border-color:#f90; } .input-label{cursor: pointer;padding: 5px;margin-right: 10px;} .input-label:hover{border-bottom: 1px dashed #ddd;} .input-label input{margin-right: 5px;vertical-align: middle;}"
	return module.exports;
})();
modules['16'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("17");

var css = require("28");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="combo"><div marker="release-tree"></div><div marker="combo-list"></div><div class="tool"><label class="input-label" style="color:#fff;"><input marker="zip" type="checkbox" name="zip" checked="checked" />压缩		</label><a marker="combo" class="button">合并</a><a marker="combo-all" class="button">合并全部</a></div></div>'),
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
modules['32'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	$ = require("2"),
	Tree = require("21"),
	ScrollBar = require("22");

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
	return module.exports;
})();
modules['33'] = (function(){
	var exports = module.exports = {};
module.exports = ".content-tree{ position: absolute; left: 300px; top: 0; right: 0; height: 100%; color: #ccc; } .content-tree .tree{ height: 100%; overflow: hidden; } .content-tree .tree-content{ padding: 10px; } .content-tree .scrollbar{ position:absolute; top:0; right:0; width:8px; height:100%; background-color:#444; overflow: hidden; } .content-tree .scrollbar-btn{ position:absolute; left:0; top:0px; width:8px; background-color:#999; border-radius:4px; } .content-tree .file{background-image: url(/pic/file-999.png);} .content-tree .folder-content{border-color: #222} .content-tree .folder-open .folder-name{ background-image: url(/pic/close-ccc.png); } .content-tree .folder-close .folder-name{ background-image: url(/pic/open-ccc.png); } .content-tree .folder-name:hover, .content-tree .file:hover{background-color: #222;} .content-tree .checked{background: url(/pic/file-checked.png) no-repeat 10px 50%;color: #f90;cursor: default;} .content-tree .checked:hover{background-color: #333;}"
	return module.exports;
})();
modules['31'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("32");

var css = require("33");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="content-tree"><div marker="tree" class="tree"><div marker="tree-content" class="tree-content"></div></div><div marker="scrollbar" class="scrollbar"><div marker="scrollbar-btn" class="scrollbar-btn"></div></div></div>'),
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
modules['30'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	content = require("18"),
	$ = require("2"),
	srcTree = require("19"),
	depsTree = require("31");

function parseTree(files){
	var src = {
			dir: "src",
			files: []
		},
		base = {
			dir: "base",
			files: []
		};
	function parse(file, files){
		if(file.length > 1){
			var _dir = file.shift(),
				_file;
			for(var i = 0, l = files.length; i < l; i ++){
				_file = files[i];
				if(typeof _file === "object"){
					if(_file.dir === _dir){
						parse(file, _file.files);
						return;
					}
				}
			}
			var _files = [];
			files.push({
				dir: _dir,
				files: _files
			});
			parse(file, _files);
		}else if(file.length === 1){
			files.push(file[0]);
		}
	}

	var file;
	for(var i = 0, l = files.length - 1; i < l; i ++){
		file = files[i];
		if(/^\$\w+\.js$/.test(file)){
			base.files.push(file.replace(/^\$/, ""));
		}else{
			parse(file.split("/"), src.files);
		}
	}

	return {
		dir: "root",
		files: [base, src]
	};
}

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = srcTree(this.nodes["src-tree"]);
		this.depsTree = depsTree(this.nodes["deps-tree"]);
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.srcTree.addEvent("select", function(file){
			file = file.replace(/^src\//, "");
			// 请求依赖数据
			$.ajax({
				url: "/ajax/deps.ihezhu?projectName=" + _this.projectName + "&file=" + file,
				dataType: "json",
				success: function(deps){
					_this.currentFile = file;
					deps = parseTree(deps);
					_this.depsTree.load(deps);
				}
			});
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求源文件目录
		$.ajax({
			url: "/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
	}
});
	return module.exports;
})();
modules['34'] = (function(){
	var exports = module.exports = {};
module.exports = ".deps{ position: absolute; width: 100%; top:62px; bottom: 0; }"
	return module.exports;
})();
modules['29'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("30");

var css = require("34");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="deps"><div marker="src-tree"></div><div marker="deps-tree"></div></div>'),
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
modules['38'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	chtml = require("6"),
	$ = require("2"),
	ScrollBar = require("22");

var parseCode = {
	base: function(code){
		// 替换html实体
		code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return code;
	},
	js: function(code){
		var cache = [];

		code = this.base(code);

		code = code
			//.replace(/.+/g, function(a){
			//	return '<li>' + a + '</li>';
			//})
			// 注释
			.replace(/\/\*[\s\S]*?\*\/|(\:)?\/\/.*/g, function(a, b){
				return b === ":" ? a : "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			// 字符串
			.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(a){
				return "___cache" + (cache.push('<span class="string">' + a + "</span>") - 1) + "___"
			})
			// 正则
			.replace(/\/(?:\\\/|[^/\r\n])+\/(?=[^\/])/g, function(a){
				return "___cache" + (cache.push('<span class="regex">' + a + "</span>") - 1) + "___";
			})
			// 关键字
			.replace(/\b(function|var|return|break|new|for|if|else|while|this|in|typeof|undefined|null|Infinity|default|switch|case|arguments|window|document|location|Object|Array|Math|RegExp|String|Date|Number|Boolean|Function)\b/g, function(a){
				return "___cache" + (cache.push('<span class="keyword">' + a + "</span>") - 1) + "___"
			})
			// 结构
			.replace(/\{|\}|\(|\)|\[|\]/g, function(a){
				return "___cache" + (cache.push('<span class="struct">' + a + "</span>") - 1) + "___";
			})
			// 操作符
			.replace(/\+|\-|\*|\/|\=+|&lt;|&gt;|&|\||\!|%/g, function(a){
				return "___cache" + (cache.push('<span class="operator">' + a + "</span>") - 1) + "___";
			})
			// commonJS
			.replace(/\b(module\.exports|exports|require)\b/g, function(a){
				return "___cache" + (cache.push('<span class="commonjs">' + a + "</span>") - 1) + "___";
			})
			// 键
			.replace(/\s[\w\$\d]+\s?(?=:)/g, function(a){
				return /___cache(\d+)___/.test(a) ? a : "___cache" + (cache.push('<span class="key">' + a + "</span>") - 1) + "___";
			})
			// 操作符
			//.replace(/\.|;|,|\:|<|>|=+|\+=|\-=|\*=|\/=|%=|>=|<=|&|\||\!|\+|\-|\*|\/|%|\(|\)|\[|\]|\{|\}/g, function(a){
			//	return "___cache" + (cache.push('<span class="operator">' + a + "</span>") - 1) + "___";
			//});

		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			//.replace(/\r|\n/g, "");
		//code = '<ol>' + code + '</ol>';

		return code;
	},
	css: function(code){
		var cache = [];

		code = this.base(code);

		// 注释
		code = code
			.replace(/\/\*[\s\S]*?\*\//g, function(a){
				return "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			.replace(/#\w+/g, function(a){
				return "___cache" + (cache.push('<span class="id">' + a + "</span>") - 1) + "___";
			})
			.replace(/\.[\w\-]+/g, function(a){
				return "___cache" + (cache.push('<span class="class">' + a + "</span>") - 1) + "___";
			})
			.replace(/[\w\-]+\s?\:/g, function(a){
				if(/___cache(\d+)___/.test(a)){
					return a;
				}else{
					return "___cache" + (cache.push('<span class="keyword">' + a + "</span>") - 1) + "___";
				}
			})
			.replace(/\d+(px|%)|\b\d+\b/g, function(a){
				return "___cache" + (cache.push('<span class="unit">' + a + "</span>") - 1) + "___";
			})
			// 结构
			.replace(/\{|\}|\(|\)|\[|\]/g, function(a){
				return "___cache" + (cache.push('<span class="struct">' + a + "</span>") - 1) + "___";
			});

		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			});

		return code;
	},
	chtml: function(code){
		code = this.base(code);

		code = this.html(code);

		code = code
			.replace(/&lt;\$(js|css)=\s([\s\S]+?)\s\$&gt;/g, function(a, b, c){
				return '&lt;$<span class="require">' + b + '</span>= <span class="require">' + c + "</span> $&gt;"
			});

		return code;
	},
	tpl: function(code){
		var cache = [],
			jsCache = [];

		code = this.base(code);

		code = this.html(code);

		code = code
			.replace(/(&lt;\$=?)\s([\s\S]+?)\s(\$&gt;)/g, function(a, b, c, d){
				return "___cache" + (cache.push('<span class="tpl-tag">' + b + "</span>") - 1) + "___ ___jsCache" + (jsCache.push(c) - 1) + "___ ___cache" + (cache.push('<span class="tpl-tag">' + d + "</span>") - 1) + "___";
			});

		var _this = this;
		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			.replace(/___jsCache(\d+)___/g, function(a, b){
				return '<span class="js">' + _this.js(jsCache[b]) + "</span>";
			});

		return code;
	},
	html: function(code){
		var cache = [],
			cssCache = [],
			jsCache = [];

		code = this.base(code);

		code = code
			// 注释
			.replace(/&lt;\!\-\-[\s\S]*?\-\-&gt;/g, function(a){
				return "___cache" + (cache.push('<span class="comments">' + a + "</span>") - 1) + "___";
			})
			// 内嵌样式
			.replace(/(&lt;style[\s\S]*?type="text\/css"[\s\S]*?&gt;)([\s\S]*?)(&lt;\/style&gt;)/g, function(a, b, c, d){
				if(c){
					return b + '___cssCache' + (cssCache.push(c) - 1) + "___" + d;
				}else{
					return a;
				}
			})
			// 内嵌js
			.replace(/(&lt;script[\s\S]*?type="text\/javascript"[\s\S]*?&gt;)([\s\S]*?)(&lt;\/script&gt;)/g, function(a, b, c, d){
				if(c){
					return b + '___jsCache' + (jsCache.push(c) - 1) + "___" + d;
				}else{
					return a;
				}
			})
			// 属性
			.replace(/&lt;[^\$][\s\S]*?[^\$]&gt;/g, function(a){
				return a
					// 属性值
					.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(a){
						return "___cache" + (cache.push('<span class="attr-value">' + a + "</span>") - 1) + "___";
					})
					// 属性名
					.replace(/(\w+)=/g, function(a, b){
						return "___cache" + (cache.push('<span class="attr-name">' + b + "</span>") - 1) + "___=";
					});
			})
			// 标签
			.replace(/(&lt;\/?)(\w+)/g, function(a, b, c){
				return b + "___cache" + (cache.push('<span class="tag">' + c + "</span>") - 1) + "___";
			});

		var _this = this;
		code = code
			.replace(/___cache(\d+)___/g, function(a, b){
				return cache[b];
			})
			.replace(/___cssCache(\d+)___/g, function(a, b){
				return '<span class="css">' + _this.css(cssCache[b]) + "</span>";
			})
			.replace(/___jsCache(\d+)___/g, function(a, b){
				return '<span class="js">' + _this.js(jsCache[b]) + "</span>";
			});

		return code;
	},
	txt: function(code){
		code = this.base(code);
		return code;
	}
};

module.exports = chtml.extend({
	init: function(opts){
		this._super(opts);

		this.scrollbar = new ScrollBar({
			box: this.nodes["code"],
			content: this.nodes["code-content"],
			scrollBarBox: this.nodes["scrollbar"],
			scrollBarBtn: this.nodes["scrollbar-btn"]
		});
	},
	view: function(code, ext){
		this.nodes["code-content"].className = ext;
		this.nodes["code-content"].innerHTML = code.length > 1000 * 200 ? parseCode.base(code) : parseCode[ext](code);
		this.nodes["code"].scrollTop = 0;
		this.scrollbar.refreshHeight();
		this.scrollbar.refreshTop();
	}
});
	return module.exports;
})();
modules['39'] = (function(){
	var exports = module.exports = {};
module.exports = ".view-code{ position: absolute; left: 300px; top: 0; right: 0; height: 100%; } /* 滚动条样式 */ .view-code .scrollbar{ position:absolute; top:0; right:0; width:8px; height:100%; background-color:#444; } .view-code .scrollbar-btn{ position:absolute; left:0; top:0px; width:8px; background-color:#999; border-radius:4px; } /* 代码样式 */ .view-code .code{ height: 100%; overflow: hidden; } .view-code .js, .view-code .css, .view-code .chtml, .view-code .tpl, .view-code .html, .view-code .txt{ padding: 10px; margin: 0; font-family: Consolas,微软雅黑; word-break: break-word; color: #fff; line-height: 18px; font-size: 14px; } /* 行号 */ .view-code ol{ color: #999; margin: 0; } .view-code li{ list-style-type: decimal; line-height: 18px; border-left: 2px solid #666; color: #fff; padding-left:20px; } .view-code li:hover{ background-color: #222; } /* 代码高亮 */ .view-code .comments{ color: #999; font-style: italic; } /* js代码高亮 */ .view-code .js .string{ /*color: #f36;*/ /*color: #FF8613;*/ color: #f66; font-weight: bold; } .view-code .js .keyword{ /*color: #9cf;*/ color: #66d9ef; } .view-code .js .operator{ color: #f92659; } .view-code .js .regex{ color: #6f9; font-weight: bold; } .view-code .js .struct{ /*color: #B1D631;*/ color: #e6db74; } .view-code .js .commonjs{ font-style: italic; font-weight: bold; color: #f33; } .view-code .js .key{ color: #B1D631; } /* css代码高亮 */ .view-code .css .id{ color: #f33; } .view-code .css .class{ color: #B1D631; } .view-code .css .keyword{ color: #66d9ef; } .view-code .css .unit{ color: #f92659; } .view-code .css .struct{ color: #ccc; } /* html代码高亮 */ .view-code .html .attr-name, .view-code .chtml .attr-name, .view-code .tpl .attr-name{ color: #B1D631; } .view-code .html .attr-value, .view-code .chtml .attr-value, .view-code .tpl .attr-value{ color: #e6db74; } .view-code .html .tag, .view-code .chtml .tag, .view-code .tpl .tag{ color: #f66; } .view-code .tpl .tpl-tag{ color: #666; font-weight: bold; } .view-code .chtml .require{ font-style: italic; font-weight: bold; color: #f33; }"
	return module.exports;
})();
modules['37'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("38");

var css = require("39");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="view-code"><div marker="code" class="code"><pre marker="code-content" class="js"></pre></div><div marker="scrollbar" class="scrollbar"><div marker="scrollbar-btn" class="scrollbar-btn"></div></div></div>'),
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
modules['36'] = (function(){
	var exports = module.exports = {};
var base = require("4"),
	content = require("18"),
	$ = require("2"),
	srcTree = require("19"),
	viewCode = require("37");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = srcTree(this.nodes["src-tree"]);
		this.viewCode = viewCode(this.nodes["file-content"]);
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.srcTree.addEvent("select", function(file){
			file = file.replace(/^src\//, "");
			_this.currentFile = file;

			var ext = file.match(/\.(\w+)$/);
			if(ext && (ext = ext[1]) && /js|css|chtml|tpl|html|txt/.test(ext)){
				_this.loadFile(file, function(code){
					_this.viewCode.view(code, ext);
				});
			}
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求发布目录
		$.ajax({
			url: "/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
	},
	loadFile: function(file, callback){
		// 请求文件内容
		$.ajax({
			url: "/ajax/file.ihezhu?projectName=" + this.projectName + "&file=" + file,
			dataType: "text",
			success: function(code){
				callback(code);
			}
		});
	}
});
	return module.exports;
})();
modules['40'] = (function(){
	var exports = module.exports = {};
module.exports = ".view-file{ position: absolute; width: 100%; top:62px; bottom: 0; }"
	return module.exports;
})();
modules['35'] = (function(){
	var exports = module.exports = {};
var base = require("4");

var js = require("36");

var css = require("40");

module.exports = function(placeNode){
	var styleNode;
	

	var node = base.toNode('<div class="view-file"><div marker="src-tree"></div><div marker="file-content"></div></div>'),
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
var $ = require("2"),
	menuMod = require("3"),
	navMod = require("13"),
	comboMod = require("16"),
	depsMod = require("29"),
	viewFileMod = require("35");

var Page = {
	projectName: "",
	menuMod: menuMod($("#menu")[0]),
	navMod: navMod($("#nav")[0]),
	contentMod: null
};

// 加载项目列表
Page.menuMod.loadProject(Object.keys(require("41").projects));
//Page.menuMod.loadProject(["project1", "ihezhu"]);
// 项目切换
Page.menuMod.addEvent("project", function(projectName){
	//console.log("project: " + projectName);
	Page.projectName = projectName;
	if(Page.contentMod){
		Page.contentMod.loadProject(projectName);
	}
});
// 文件操作
Page.menuMod.addEvent("file", function(type){
	//console.log("type: " + type);
});

// 导航切换
Page.navMod.addEvent("change", function(value){
	var placeNode;
	if(Page.contentMod){
		placeNode = Page.contentMod.dispose();
	}else{
		placeNode = $("#content")[0];
	}
	switch(value){
		case "combo":
			Page.contentMod = comboMod(placeNode);
			break;
		case "deps":
			Page.contentMod = depsMod(placeNode);
			break;
		case "view-file":
			Page.contentMod = viewFileMod(placeNode);
			break;
	}
	if(Page.projectName && Page.contentMod){
		Page.contentMod.loadProject(Page.projectName);
	}
});

module.exports = Page;
	return module.exports;
})();
	Fan.modules = modules;
})()