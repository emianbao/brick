var //$			= require("module/jquery.js"),
	filterMod	= require("./chtml/filter/filter.chtml"),
	listMod		= require("./chtml/list/list.chtml");

filterMod = filterMod(document.getElementById("filter"));
listMod = listMod(document.getElementById("list"));

listMod.view([1,2,3,4,5,6,7,8,9,10]);