var Message = function(msg) {
	var message = this;
    
	//持续时间300/33.3
	this.age = 1;
	this.maxAge = 300;
	
	this.message = msg;
	
	this.update = function() {
		this.age++;
	}
	
	this.draw = function(context,x,y,i) {
        
		var fontsize = 8;
		context.font = fontsize + "px 'proxima-nova-1','proxima-nova-2', arial, sans-serif";
		context.textBaseline = 'hanging';
        
		//对话框内边距
		var paddingH = 3;
		var paddingW = 6;
        
		//对话框属性
		var messageBox = {
			width: context.measureText(message.message).width + paddingW * 2,
			height: fontsize + paddingH * 2,
			x: x,
			y: (y - i * (fontsize + paddingH * 2 +1))-20 //计算y
		}
        
		//淡出持续时间
		var fadeDuration = 20;
        
		//对话框淡出
		var opacity = (message.maxAge - message.age) / fadeDuration;
		opacity = opacity < 1 ? opacity : 1;
        
		//绘制聊天框
		context.fillStyle = 'rgba(255,255,255,'+opacity/20+')';
		drawRoundedRectangle(context, messageBox.x, messageBox.y, messageBox.width, messageBox.height, 10);
		context.fillStyle = 'rgba(255,255,255,'+opacity+')';
		context.fillText(message.message, messageBox.x + paddingW, messageBox.y + paddingH, 100);
	}
    
	//画圆角矩形函数
	var drawRoundedRectangle = function(ctx,x,y,w,h,r) {
		var r = r / 2;
		ctx.beginPath();
		ctx.moveTo(x, y+r);
		ctx.lineTo(x, y+h-r);
		ctx.quadraticCurveTo(x, y+h, x+r, y+h);
		ctx.lineTo(x+w-r, y+h);
		ctx.quadraticCurveTo(x+w, y+h, x+w, y+h-r);
		ctx.lineTo(x+w, y+r);
		ctx.quadraticCurveTo(x+w, y, x+w-r, y);
		ctx.lineTo(x+r, y);
		ctx.quadraticCurveTo(x, y, x, y+r);
		ctx.closePath();
		ctx.fill();
	}
}