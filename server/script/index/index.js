var $ = require("lib/jquery.js"),
	menuMod = require("script/index/menu/menu.chtml"),
	navMod = require("script/index/nav/nav.chtml"),
	comboMod = require("script/index/combo/combo.chtml"),
	depsMod = require("script/index/deps/deps.chtml"),
	viewFileMod = require("script/index/viewFile/viewFile.chtml");

var Page = {
	projectName: "",
	menuMod: menuMod($("#menu")[0]),
	navMod: navMod($("#nav")[0]),
	contentMod: null
};

// 加载项目列表
//Page.menuMod.loadProject(Object.keys(require("config.js").projects));
Page.menuMod.loadProject(["project1", "ihezhu"]);
// 项目切换
Page.menuMod.addEvent("project", function(projectName){
	//console.log("project: " + projectName);
	Page.projectName = projectName;
	if(Page.contentMod){
		Page.contentMod.loadProject(projectName);
	}
});
// 文件操作
Page.menuMod.addEvent("file", function(type){
	//console.log("type: " + type);
});

// 导航切换
Page.navMod.addEvent("change", function(value){
	var placeNode;
	if(Page.contentMod){
		placeNode = Page.contentMod.dispose();
	}else{
		placeNode = $("#content")[0];
	}
	switch(value){
		case "combo":
			Page.contentMod = comboMod(placeNode);
			break;
		case "deps":
			Page.contentMod = depsMod(placeNode);
			break;
		case "view-file":
			Page.contentMod = viewFileMod(placeNode);
			break;
	}
	if(Page.projectName && Page.contentMod){
		Page.contentMod.loadProject(Page.projectName);
	}
});

module.exports = Page;