seajs.config({
    base: '/seajs/',
    charset: 'utf-8'
});
seajs.use(['lib/jquery.js', 'module/scrollbar.js'], function($, ScrollBar) {
	//return;
	$.ajax({
		url: "ajax/project.ihezhu?projectName=project1",
		dataType: "json",
		success: function(config){
			$.fn.extend({
				parseNode: function(){
					var _nodes = this[0].getElementsByTagName("*"),
						nodes = {},
						marker;
					for(var i = 0, l = _nodes.length; i < l; i ++){
						if(marker = _nodes[i].getAttribute("marker")){
							nodes[marker] = _nodes[i];
						}
					}
					return nodes;
				}
			});
			var minNodes = $("#min").parseNode(),
				comboNodes = $("#combo").parseNode(),
				footerNodes = $("#footer").parseNode();

			var scrollbarMin = new ScrollBar({
					box: minNodes["box"],
					content: minNodes["content"],
					scrollBarBox: minNodes["scrollbar"],
					scrollBarBtn: minNodes["scrollbar-btn"]
				}),
				scrollbarCombo = new ScrollBar({
					box: comboNodes["box"],
					content: comboNodes["content"],
					scrollBarBox: comboNodes["scrollbar"],
					scrollBarBtn: comboNodes["scrollbar-btn"]
				});

			// 渲染文件树
			function renderTree(node, data){
				node.innerHTML = (function(data, dir){
					data.files && data.files.sort(function(a, b){
						if(typeof a === "string" && typeof b === "string"){
							return a - b;
						}else if(typeof a === "string"){
							return -1;
						}else if(typeof b === "string"){
							return 1;
						}else{
							return a.dir - b.dir;
						}
					});
					if(typeof data === "string"){
						return '<a class="file" dir="' + dir + data + '">' + data + '</a>';
					}else{
						dir += data.dir + "/";
						var html = ['<div class="folder-open"><a class="folder-name">' + data.dir + '</a><div class="folder-content">'];
						for(var i = 0, l = data.files.length; i < l; i ++){
							html.push(arguments.callee(data.files[i], dir));
						}
						html.push('</div></div>');
						return html.join('');
					}
				})(data, "");
			}
			// 请求js压缩目录
			$.ajax({
				url: "ajax/releaseFileList.ihezhu?projectName=project1",
				dataType: "json",
				success: function(files){
					renderTree(minNodes["content"], files);
					$(".file[dir='" + location.hash.replace("#","") + "']", $(minNodes["content"])).click();
					scrollbarMin.refreshHeight();
					scrollbarMin.refreshTop();
				}
			});
			// 绑定文件夹折叠事件
			$(document).delegate(".folder-name", "click", function(e){
				var target = e.target;
				if(target.className === "folder-name"){
					target = target.parentNode;
					target.className = target.className === "folder-open" ? "folder-close" : "folder-open";
					scrollbarMin.refreshHeight();
				}
			});
			// 选择一个压缩文件
			$(minNodes["content"]).delegate(".file", "click", function(e){
				var target = e.target,
					dir = target.getAttribute("dir");
				location.hash = dir;
				dir = dir.replace(/^release\//, "");
				var combo = config.combo[dir];
				if(combo){
					comboNodes["content"].innerHTML = '<a class="file">' + combo.join('</a><a class="file">') + '</a>';
				}else{
					comboNodes["content"].innerHTML = '<a class="file">' + dir + '</a>';
				}
				comboNodes["combo"].file = dir;
				$(".checked", $(minNodes["content"])).removeClass("checked");
				$(target).addClass("checked");
			});

			$(comboNodes["combo"]).click(function(){
				var file = this.file;
				if(file){
					$.ajax({
						url: "ajax/combo.ihezhu",
						type: "POST",
						data: {
							projectName: "project1",
							file: file,
							zip: comboNodes["zip"].checked
						},
						success: function(result){
							console.log(result);
						}
					});
				}
			});

			$(footerNodes["combo-all"]).click(function(){
				$.ajax({
					url: "ajax/combo.ihezhu",
					type: "POST",
					data: {
						projectName: "project1",
						zip: footerNodes["zip"].checked
					},
					success: function(result){
						console.log(result);
					}
				});
			});
		}
	});
});