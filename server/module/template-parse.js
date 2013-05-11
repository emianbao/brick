module.exports = {
	parse: function (template) {
		var __list__ = [];
		try {
			return eval("(function(){return function(GlobalData){var __result__ = [];" + ("$>" + template + "<$").replace(/<\$= ([\s\S]*?) \$>/g, function (a, b) {
				return "<$ __result__.push(" + b + "); $>";
			}).replace(/\$>([\s\S]*?)<\$/g, function (a, b) {
				if (/^\s*$/.test(b))
					return "";
				else
					return "__result__.push(__list__[" + (__list__.push(b) - 1) + "]);";
			}) + "return __result__.join('');}})()");
		} catch (e) {
			return function(){}
		}
	},
	replace: function (template, data) {
		var t = this.parse(template);
		if (t) {
			try {
				return t(data);
			} catch (e) {
				return "";
			}
		} else {
			return "";
		}
	}
};