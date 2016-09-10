//var settings = new Settings();

var debug = true;
var isStatsOn = false; //显示FPS
var timeout = 0;
var has_set_timeout = 0;
var authWindow;

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.getElementById("fps").appendChild( stats.dom );

var app;
var runLoop = function() {
    stats.begin();
	app.update();
	app.draw();
    stats.end();
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
	app = new App(document.getElementById('canvas'));
    
    //绑定窗口变化
	window.addEventListener('resize', app.resize, false);
    
    //绑定按键,鼠标事件
    
	document.addEventListener('mousemove', 		app.mousemove, false);
	document.addEventListener('mousedown', 		app.mousedown, false);
	document.addEventListener('mouseup',			app.mouseup, false);
	
    /*
	document.addEventListener('touchstart',   app.touchstart, false);
	document.addEventListener('touchend',     app.touchend, false);
	document.addEventListener('touchcancel',  app.touchend, false);
	document.addEventListener('touchmove',    app.touchmove, false);	
    */
    
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
    /*
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
    */
});