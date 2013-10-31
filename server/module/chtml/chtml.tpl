var base = require("$base.js");

var js = require("<$= GlobalData.js $>");
<$ if(GlobalData.css){ $>
var css = require("<$= GlobalData.css $><$= GlobalData.cssTitle ? "?" + GlobalData.cssTitle : "" $>");
<$ } $>

module.exports = js.extend({
	init: function(){
		var styleNode;
		<$ if(GlobalData.css){ $>
			styleNode = base.insertStyleFragment(css, null, "<$= GlobalData.cssTitle $>");
		<$ } $>

		//var node = base.toNode('<$= GlobalData.html.replace(/\r\n/g, "").replace(/\\/g, "\\\\").replace(/'/g, "\\'") $>');
		var node = base.toNode((<$= GlobalData.html $>)(arguments[0]));
		document.body.appendChild(node.node);

		base.extend(this, {
			node: node,
			styleNode: styleNode,
			styleTitle: "<$= GlobalData.cssTitle $>",
			nodes: base.parseNode(node)
		});

		this._super.apply(this, arguments);
	}
});