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
            documentFragment.appendChild(childNodes[i]);
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