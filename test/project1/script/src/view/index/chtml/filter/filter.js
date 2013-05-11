var base = require("$base.js"),
	chtml = require("$chtml.js");

module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);
	}
});