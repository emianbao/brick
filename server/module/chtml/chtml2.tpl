var base = require("$base.js");

var js = require("<$= GlobalData.js $>");

module.exports = js.extend({
	init: function(node){
		if(!(node instanceof Array)){
			node = [node];
		}

		base.extend(this, {
			node: node,
			nodes: base.parseNode(node)
		});

		this._super.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});