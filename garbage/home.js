window.onload = function(){
	setEvent();
}
function setEvent(){
	var main = document.getElementsByClassName('main')[0];
		divs = main.getElementsByClassName('ball'),
		i = 0,
		len = divs.length;
	for(;i<len;i++){
		divs[i].onmouseover = function(){
			console.log('mouseover');
			if(main.className.indexOf('paused') < 0){
				main.className += ' paused';
			}
		};
		divs[i].onmouseout = function(){
			main.className = main.className.replace(/paused/g,'').replace(/^\s+/g,'').replace(/\s+$/g,'');
		};
	}
}

