//From Tadpole http://kedou.workerman.net/js/Camera.js

var Camera = function(aCanvas, aContext, x, y) {
	var camera = this;
	
	var canvas = aCanvas;
	var context = aContext;
	
	this.x = x;
	this.y = y;
	
	this.minZoom = 1.3;
	this.maxZoom = 1.8;
	this.zoom = this.minZoom;
	
	var backgroundColor = Math.random()*360;
	
    //app.draw事件中调用,先setupContext再startUIlayer
    
	this.setupContext = function() {
        //
		var translateX = canvas.width / 2 - camera.x * camera.zoom;
		var translateY = canvas.height / 2 - camera.y * camera.zoom;
		
		//将transfrom归为正常以绘制填充
		context.setTransform(1,0,0,1,0,0);
        
        //过渡上色
		context.fillStyle = 'hsl('+backgroundColor+',50%,3%)';
		context.fillRect(0,0,canvas.width, canvas.height);
		
        //translate() 方法重新映射画布上的 (0,0) 位置。
        //scale() 方法缩放当前绘图，更大或更小。基于1.
		context.translate(translateX, translateY);
		context.scale(camera.zoom, camera.zoom);
		
        //调试
		if(debug) {
			drawDebug();
		}
	};
	
	this.update = function(model) {
        
        //背景色调渐变
		backgroundColor += 0.02;
		backgroundColor = backgroundColor > 360 ? 0 : backgroundColor;
		
        
        //下面的部分待看懂
		var targetZoom = (model.camera.maxZoom + (model.camera.minZoom - model.camera.maxZoom) * Math.min(model.userTadpole.speed, model.userTadpole.speedMax) / model.userTadpole.speedMax);
		model.camera.zoom += (targetZoom - model.camera.zoom) / 60;
		
		var delta = {
			x: (model.userTadpole.x - model.camera.x) / 30,
			y: (model.userTadpole.y - model.camera.y) / 30
		}
		
		if(Math.abs(delta.x) + Math.abs(delta.y) > 0.1) {
			model.camera.x += delta.x;
			model.camera.y += delta.y;
			
			for(var i = 0, len = model.decoStars.length; i < len; i++) {
				var wp = model.decoStars[i];
				wp.x -= (wp.z - 1) * delta.x;
				wp.y -= (wp.z - 1) * delta.y;
			}
		}
	};
	
	// 返回当前缩放水平的边界 Gets bounds of current zoom level of current position
	this.getBounds = function() {
		return [
			{x: camera.x - canvas.width / 2 / camera.zoom, y: camera.y - canvas.height / 2 / camera.zoom},
			{x: camera.x + canvas.width / 2 / camera.zoom, y: camera.y + canvas.height / 2 / camera.zoom}
		];
	};
	
	// Gets bounds of minimum zoom level of current position
	this.getOuterBounds = function() {
		return [
			{x: camera.x - canvas.width / 2 / camera.minZoom, y: camera.y - canvas.height / 2 / camera.minZoom},
			{x: camera.x + canvas.width / 2 / camera.minZoom, y: camera.y + canvas.height / 2 / camera.minZoom}
		];
	};
	
	// Gets bounds of maximum zoom level of current position
	this.getInnerBounds = function() {
		return [
			{x: camera.x - canvas.width / 2 / camera.maxZoom, y: camera.y - canvas.height / 2 / camera.maxZoom},
			{x: camera.x + canvas.width / 2 / camera.maxZoom, y: camera.y + canvas.height / 2 / camera.maxZoom}
		];
	};
	
    //将transfrom归为正常以绘制UI
	this.startUILayer = function() {
		context.setTransform(1,0,0,1,0,0);
	}
	
    //debug
	var debugBounds = function(bounds) {
		context.strokeStyle   = '#fff';
		context.beginPath();
		context.moveTo(bounds[0].x, bounds[0].y);
		context.lineTo(bounds[0].x, bounds[1].y);
		context.lineTo(bounds[1].x, bounds[1].y);
		context.lineTo(bounds[1].x, bounds[0].y);
		context.closePath();
		context.stroke();
        
	};
	
	var drawDebug = function() {
		//debugBounds(camera.getInnerBounds());
		//debugBounds(camera.getBounds());
        //debugThings(camera.getBounds());
	};
};