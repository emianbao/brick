var base = require("$base.js"),
	content = require("script/index/content.js"),
	$ = require("lib/jquery.js"),
	releaseTree = require("script/index/navTree/navTree.chtml"),
	comboList = require("script/index/comboList/comboList.chtml");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.releaseTree = releaseTree(this.nodes["release-tree"]);
		this.comboList = comboList(this.nodes["combo-list"]);
		this.comboConfig = {};
		this.projectName = "";
		this.currentFile = "";

		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		// 选择一个文件
		this.releaseTree.addEvent("select", function(file){
			file = file.replace(/^release\//, "");
			var comboFiles = _this.comboConfig[file];
			if(comboFiles){
				_this.currentFile = file;
				_this.comboList.view(comboFiles);
			}
		});
		// 压缩选中文件
		$(this.nodes["combo"]).click(function(){
			if(_this.projectName && _this.currentFile){
				$.ajax({
					url: "http://127.0.0.1:10000/ajax/combo.ihezhu",
					type: "POST",
					data: {
						projectName: _this.projectName,
						file: _this.currentFile,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						console.log(result);
					}
				});
			}
		});
		// 压缩当前项目所有文件
		$(this.nodes["combo-all"]).click(function(){
			if(_this.projectName){
				$.ajax({
					url: "http://127.0.0.1:10000/ajax/combo.ihezhu",
					type: "POST",
					data: {
						projectName: _this.projectName,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	loadProject: function(projectName){
		var _this = this;

		this.projectName = projectName;
		// 请求发布目录
		$.ajax({
			url: "http://127.0.0.1:10000/ajax/releaseFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.releaseTree.load(files);
			}
		});
		// 请求合并配置
		$.ajax({
			url: "http://127.0.0.1:10000/ajax/combo-config.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(comboConfig){
				_this.comboConfig = comboConfig;
			}
		});
	}
});