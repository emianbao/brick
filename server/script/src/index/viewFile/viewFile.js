var base = require("$base.js"),
	content = require("../content.js"),
	$ = require("lib/jquery.js"),
	srcTree = require("../navTree/navTree.chtml"),
	viewCode = require("../viewCode/viewCode.chtml");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = (new srcTree()).place(this.nodes["src-tree"]);
		this.viewCode = (new viewCode()).place(this.nodes["file-content"]);
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
			url: "/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
	},
	loadFile: function(file, callback){
		// 请求文件内容
		$.ajax({
			url: "/ajax/file.ihezhu?projectName=" + this.projectName + "&file=" + file,
			dataType: "text",
			success: function(code){
				callback(code);
			}
		});
	}
});