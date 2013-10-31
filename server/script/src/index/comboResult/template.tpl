<$	var failList, i, l;
	for(var file in GlobalData){
		failList = GlobalData[file];
$>
	<$ if(failList.length){ $>
		<div class="fail">
			<$= file $>
			<$ for(i = 0, l = failList.length; i < l; i ++){ $>
				<div>
					<span><$= failList[i].file $></span>
					from
					<span><$= failList[i].sourceFile $></span>
				</div>
			<$ } $>
		</div>
	<$ } else { $>
		<div class="ok"><$= file $></div>
	<$ } $>
<$ } $>