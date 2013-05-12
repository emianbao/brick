var base = require("$base.js"),
	content = require("script/index/content.js"),
	$ = require("lib/jquery.js"),
	srcTree = require("script/index/navTree/navTree.chtml"),
	depsTree = require("script/index/contentTree/contentTree.chtml");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = srcTree(this.nodes["src-tree"]);
		this.depsTree = depsTree(this.nodes["deps-tree"]);
		this.deps = {};
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.srcTree.addEvent("select", function(file){
			file = file.replace(/^src\//, "");
			var deps = _this.deps[file];
			if(deps){
				_this.currentFile = file;
				_this.depsTree.load(deps);
			}
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求源文件目录
		$.ajax({
			url: "http://127.0.0.1:10000/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
		// 请求依赖数据
		/*$.ajax({
			url: "http://127.0.0.1:10000/ajax/deps.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(deps){
				_this.deps = deps;
			}
		});*/
	}
});