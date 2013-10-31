var base = require("$base.js"),
	content = require("../content.js"),
	$ = require("lib/jquery.js"),
	releaseTree = require("../navTree/navTree.chtml"),
	comboList = require("../comboList/comboList.chtml"),
	comboResult = require("../comboResult/comboResult.chtml");

module.exports = content.extend({
	init: function(opts){
		this._super(opts);

		this.releaseTree = (new releaseTree()).place(this.nodes["release-tree"]);
		this.comboList = (new comboList()).place(this.nodes["combo-list"]);
		this.comboResult = (new comboResult()).place(this.nodes["combo-result"]);
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
					url: "/ajax/combo.ihezhu",
					type: "POST",
					dataType: "json",
					data: {
						projectName: _this.projectName,
						file: _this.currentFile,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						//console.log(result);
						_this.comboResult.view(result);
					}
				});
			}
		});
		// 压缩当前项目所有文件
		$(this.nodes["combo-all"]).click(function(){
			if(_this.projectName){
				$.ajax({
					url: "/ajax/combo.ihezhu",
					type: "POST",
					dataType: "json",
					data: {
						projectName: _this.projectName,
						zip: _this.nodes["zip"].checked
					},
					success: function(result){
						//console.log(result);
						_this.comboResult.view(result);
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
			url: "/ajax/releaseFileList.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(files){
				_this.releaseTree.load(files);
			}
		});
		// 请求合并配置
		$.ajax({
			url: "/ajax/combo-config.ihezhu?projectName=" + projectName,
			dataType: "json",
			success: function(comboConfig){
				_this.comboConfig = comboConfig;
			}
		});
	}
});