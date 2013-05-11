var base = require("$base.js");

var js = require("<$= GlobalData.js $>");
<$ if(GlobalData.css){ $>
var css = require("<$= GlobalData.css $>");
<$ } $>
module.exports = function(placeNode){
	var styleNode;
	<$ if(GlobalData.css){ $>
		var doc = base.document(placeNode);
		styleNode = doc.createElement("style");
		styleNode.type = "text/css";
		styleNode.innerHTML = css;
		(doc.head || doc.getElementsByTagName("head")[0]).appendChild(styleNode);
	<$ } $>

	var node = base.toNode('<$= GlobalData.html.replace(/\\/g, "\\\\").replace(/'/g, "\\'") $>');
	placeNode.parentNode.replaceChild(node, placeNode);

	return new js({
		node: node,
		styleNode: styleNode,
		nodes: base.parseNode(node)
	});
};