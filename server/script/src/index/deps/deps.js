var base = require("$base.js"),
	content = require("../content.js"),
	$ = require("lib/jquery.js"),
	srcTree = require("../navTree/navTree.chtml"),
	depsTree = require("../contentTree/contentTree.chtml");

function parseTree(files){
	var src = {
			dir: "src",
			files: []
		},
		base = {
			dir: "base",
			files: []
		};
	function parse(file, files){
		if(file.length > 1){
			var _dir = file.shift(),
				_file;
			for(var i = 0, l = files.length; i < l; i ++){
				_file = files[i];
				if(typeof _file === "object"){
					if(_file.dir === _dir){
						parse(file, _file.files);
						return;
					}
				}
			}
			var _files = [];
			files.push({
				dir: _dir,
				files: _files
			});
			parse(file, _files);
		}else if(file.length === 1){
			files.push(file[0]);
		}
	}

	var file;
	for(var i = 0, l = files.length - 1; i < l; i ++){
		file = files[i];
		if(/^\$\w+\.js$/.test(file)){
			base.files.push(file.replace(/^\$/, ""));
		}else{
			parse(file.split("/"), src.files);
		}
	}

	return {
		dir: "root",
		files: [base, src]
	};
}

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.srcTree = (new srcTree()).place(this.nodes["src-tree"]);
		this.depsTree = (new depsTree()).place(this.nodes["deps-tree"]);
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.srcTree.addEvent("select", function(file){
			file = file.replace(/^src\//, "");
			// 请求依赖数据
			$.ajax({
				url: "/ajax/deps.ihezhu?projectName=" + _this.projectName + "&file=" + file,
				dataType: "json",
				success: function(deps){
					_this.currentFile = file;
					deps = parseTree(deps);
					_this.depsTree.load(deps);
				}
			});
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求源文件目录
		$.ajax({
			url: "/ajax/srcFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.srcTree.load(files);
			}
		});
	}
});