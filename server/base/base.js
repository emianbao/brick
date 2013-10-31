module.exports = {
	// 扩展对象
	extend: function (target, src, complete) {
        if (typeof src === "undefined") {
            return target;
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
    // 解析node内标记的节点
	parseNode: function(node, key){
		var i,
			l,
			nodes = {},
			_this = this;

		if(node instanceof Array){
			var self = arguments.callee;
			for(i = 0, l = node.length; i < l; i ++){
				this.extend(nodes, self(node[i], key));
			}
		}else{
			key = key || "marker";
			var _nodes = node.getElementsByTagName("*"),
				marker;
			if(marker = node.getAttribute(key)){
				nodes[marker] = node;
			}
			for(var i = 0, l = _nodes.length; i < l; i ++){
				if(marker = _nodes[i].getAttribute(key)){
					nodes[marker] = _nodes[i];
				}
			}
		}
		return nodes;
	},
	// 将html字符串解析为html节点
	toNode: function(str){
        var div = document.createElement("div"),
            documentFragment = document.createDocumentFragment();
        div.innerHTML = str;
        var childNodes = div.childNodes,
        	elements = [],
        	element;
        for(var i = 0, l = childNodes.length; i < l; i ++){
        	element = childNodes[0];
        	if(element.nodeType === 1 || (element.nodeType === 3 && !/^\s+$/.test(element.nodeValue))){
        		elements.push(element);
        	}
            documentFragment.appendChild(element);
        }
        div = null;
        elements.node = documentFragment;
        return elements;
	},
	// 向文档插入css片段
	insertStyleFragment: function(styleText, doc, title){
		doc = doc || document;
		title = title ? ' title="' + title + '"' : "";
		var styleNode = doc.createElement("div");
		styleNode.innerHTML = '<br /><style type="text/css"' + title + '>' + styleText + '</style>';
		return doc.getElementsByTagName("head")[0].appendChild(styleNode.lastChild);
	},
	each: function(list, fn){
		if(list.forEach){
			list.forEach(fn);
		}else{
			for(var i = 0, l = list.length; i < l; i ++){
				fn(list[i], i, list);
			}
		}
	}
};