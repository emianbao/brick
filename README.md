javascript模块化开发框架


开发环境基于seajs

发布时通过nodejs进行模块解析、依赖处理、合并压缩, 客户端框架核心代码不到2K


模版存放在单独模版文件中
默认模版文件以.tpl结尾，模版语法参见默认默认模版引擎
（如果想使用其他模版引擎，请在根目录config文件中的program项设置文件后缀及处理程序）

子控件（参考asp.net中的用户控件）
一个子控件一般包含3个文件
.chtml结尾的为页面文件，文件内存放模块的html片段
.js文件为模块的处理程序，继承自module/chtml.js
.css文件为模块的样式文件（可省略）
发布时，一个子控件会被处理成一个标准的CommonJS模块


默认模版引擎为html和js混合的以<$ code $>区分的模版语法
例：
<ul>
	<$ for(var i = 0, l = GlobalData.length; i < l; i ++){ $>
	<li>
		<$= i $>、<$= GlobalData[i] $>
	</li>
	<$ } $>
</ul>
传入数据：["a", "b", "c"]
=>
<ul>
	<li>0、a</li>
	<li>1、b</li>
	<li>2、c</li>
</ul>

一个模版可以引用其他模版
例：
<$# templateName = xxx.tpl $>
<div>
	<$ if(GlobalData.type === "type1"){ $>
		<$= templateName(GlobalData.name) $>
	<$ } else { $>
		<a><$= GlobalData.name $></a>
	<$ } $>
</div>