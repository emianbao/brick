var object = require("./object.js"),
	base = require("./base.js"),
	Event = require("./event.js");

module.exports = object.extend(base.extend({
	node: null,
	styleNode: null,
	dispose: function(){
		this.node.parentNode.removeChild(this.node);
		if(this.styleNode){
			this.styleNode.parentNode.removeChild(this.styleNode);
		}
	}
}, Event));