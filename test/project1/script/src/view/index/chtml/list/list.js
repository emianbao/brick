var base = require("$base.js"),
	chtml = require("$chtml.js"),
	listTemplate = require("../../template/list.tpl");

module.exports = chtml.extend({
	init: function(opts){
		base.extend(this, opts);
	},
	view: function(data){
		this.nodes["list"].innerHTML = listTemplate(data);
	}
});