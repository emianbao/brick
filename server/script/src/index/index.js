var $ = require("lib/jquery.js"),
	menuMod = require("./menu/menu.chtml"),
	navMod = require("./nav/nav.chtml"),
	comboMod = require("./combo/combo.chtml"),
	depsMod = require("./deps/deps.chtml"),
	viewFileMod = require("./viewFile/viewFile.chtml");

var Page = {
	projectName: "",
	menuMod: (new menuMod()).place($("#menu")[0]),
	navMod: (new navMod()).place($("#nav")[0]),
	contentMod: null
};

// 加载项目列表
Page.menuMod.loadProject(Object.keys(require("config.js").projects));
//Page.menuMod.loadProject(["project1", "ihezhu"]);
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
			Page.contentMod = (new comboMod()).place(placeNode);
			break;
		case "deps":
			Page.contentMod = (new depsMod()).place(placeNode);
			break;
		case "view-file":
			Page.contentMod = (new viewFileMod()).place(placeNode);
			break;
	}
	if(Page.projectName && Page.contentMod){
		Page.contentMod.loadProject(Page.projectName);
	}
});

module.exports = Page;