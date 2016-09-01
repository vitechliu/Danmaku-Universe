var settings = new Settings();

var debug = true;
var isStatsOn = false; //显示FPS
var timeout = 0;
var has_set_timeout = 0;
var authWindow;

var app;
var runLoop = function() {
	app.update();
	app.draw();
    window.requestAnimFrame(runLoop);
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback,element) {
            return window.setTimeout(callback, 1000/60);
        };
})();

var initApp = function() {
	if (app!=null) { return; }
	app = new App(settings, document.getElementById('canvas'));
    
    //绑定窗口变化
	window.addEventListener('resize', app.resize, false);
    
    //绑定按键,鼠标事件
    
	document.addEventListener('mousemove', 		app.mousemove, false);
	document.addEventListener('mousedown', 		app.mousedown, false);
	document.addEventListener('mouseup',			app.mouseup, false);
	
	document.addEventListener('touchstart',   app.touchstart, false);
	document.addEventListener('touchend',     app.touchend, false);
	document.addEventListener('touchcancel',  app.touchend, false);
	document.addEventListener('touchmove',    app.touchmove, false);	

	document.addEventListener('keydown',    app.keydown, false);
	document.addEventListener('keyup',    app.keyup, false);
    
	window.requestAnimFrame(runLoop);
	//setInterval(runLoop,1000/60); //runloop主update函数！！！ 实际帧速为33.3
}

//强制启动,隐藏浏览器提示
var forceInit = function() { 
	initApp()
	document.getElementById('unsupported-browser').style.display = "none";
	return false;
}

//判断浏览器支持
if(Modernizr.canvas && Modernizr.websockets) { 
	initApp();
} else {
	document.getElementById('unsupported-browser').style.display = "block";	
	document.getElementById('force-init-button').addEventListener('click', forceInit, false);
}

//加入FPS
var addStats = function() { 
	if (isStatsOn) { return; }
	// Draw fps
	var stats = new Stats();
	document.getElementById('fps').appendChild(stats.domElement);

	setInterval(function () {
	    stats.update();
	}, 1000/60);

	// Array Remove - By John Resig (MIT Licensed)
	Array.remove = function(array, from, to) {
	  var rest = array.slice((to || from) + 1 || array.length);
	  array.length = from < 0 ? array.length + from : from;
	  return array.push.apply(array, rest);
	};
	isStatsOn = true;
}


if(debug) { addStats(); }

//新窗口打开
$(function() {
	$('a[rel=external]').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'));
	});
});

//禁止复制
document.body.onselectstart = function() { return false; }


$(document).ready(function(){
    
    //输入昵称
    
	$('#nick').blur(function(){
		app.sendMessage('name:'+$('#nick').val());
		$('#chat').focus();
	});
	$('#sex0').click(function(){
		app.setsex(0);
	});
	$('#sex1').click(function(){
		app.setsex(1);
	});
});