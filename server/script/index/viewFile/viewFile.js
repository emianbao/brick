var base = require("$base.js"),
	content = require("script/index/content.js"),
	$ = require("lib/jquery.js"),
	srcTree = require("script/index/navTree/navTree.chtml"),
	viewCode = require("script/index/viewCode/viewCode.chtml");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = srcTree(this.nodes["src-tree"]);
		this.viewCode = viewCode(this.nodes["file-content"]);
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.srcTree.addEvent("select", function(file){
			file = file.replace(/^src\//, "");
			_this.currentFile = file;

			var ext = file.match(/\.(\w+)$/);
			if(ext && (ext = ext[1]) && /js|css|chtml|tpl|html|txt/.test(ext)){
				_this.loadFile(file, function(code){
					_this.viewCode.view(code, ext);
				});
			}
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求发布目录
		$.ajax({
			url: "http://127.0.0.1:10000/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
	},
	loadFile: function(file, callback){
		// 请求文件内容
		$.ajax({
			url: "http://127.0.0.1:10000/ajax/file.ihezhu?projectName=" + this.projectName + "&file=" + file,
			dataType: "text",
			success: function(code){
				callback(code);
			}
		});
	}
});