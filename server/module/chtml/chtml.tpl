var base = require("$base.js");

var js = require("<$= GlobalData.js $>");
<$ if(GlobalData.css){ $>
var css = require("<$= GlobalData.css $>");
<$ } $>
module.exports = function(placeNode){
	var styleNode;
	<$ if(GlobalData.css && false){ $>
		var doc = base.document(placeNode);
		styleNode = doc.createElement("div");
		styleNode.innerHTML = '<br /><style type="text/css">' + css + '</style>';
		styleNode = doc.getElementsByTagName("head")[0].appendChild(styleNode.lastChild);
	<$ } $>

	var node = base.toNode('<$= GlobalData.html.replace(/\r\n/g, "").replace(/\\/g, "\\\\").replace(/'/g, "\\'") $>'),
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