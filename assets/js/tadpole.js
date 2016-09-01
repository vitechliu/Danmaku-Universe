var Tadpole = function() {
	var tadpole = this;
	//初始位置随机 300*300矩形内
    
	this.x = Math.random() * 300 - 150;
	this.y = Math.random() * 300 - 150;
    
    //圆的半径
	this.size = 4;
	
	this.name = '';
	this.age = 0;
	//this.sex = -1;
	//this.icon = '/images/default.png'; //头像
	this.img = {};
	
	this.hover = false;

	this.momentum = 0;
	this.maxMomentum = 2;
	this.angle = Math.PI * 2;
	
	this.targetX = 0;
	this.targetY = 0;
	this.targetMomentum = 0;
	
    //消息
	this.messages = [];
    
    //不活动时间
	this.timeSinceLastActivity = 0;
	
	this.changed = 0;
    
    //无服务器加载时间
	this.timeSinceLastServerUpdate = 0;
	
	this.update = function(mouse) {
		tadpole.timeSinceLastServerUpdate++;
		
        //以动量和角度更新蝌蚪坐标(全局坐标)
		tadpole.x += Math.cos(tadpole.angle) * tadpole.momentum;
		tadpole.y += Math.sin(tadpole.angle) * tadpole.momentum;
		
		if(tadpole.targetX != 0 || tadpole.targetY != 0) {
			tadpole.x += (tadpole.targetX - tadpole.x) / 20;
			tadpole.y += (tadpole.targetY - tadpole.y) / 20;
		}
		
		//更新消息队列
		for (var i = tadpole.messages.length - 1; i >= 0; i--) {
			var msg = tadpole.messages[i];
			msg.update();
			
			if(msg.age == msg.maxAge) {
				tadpole.messages.splice(i,1);
			}
		}

		// 如果鼠标悬浮在主机上，就把hover为true，同时更新mouse.tadpole
		if(Math.sqrt(Math.pow(tadpole.x - mouse.worldx,2) + Math.pow(tadpole.y - mouse.worldy,2)) < tadpole.size+2) {
			tadpole.hover = true;
			mouse.tadpole = tadpole;
		}
		else {
            //否则置hover为false
			tadpole.hover = false;
		}
        
        //更新尾巴
		//tadpole.tail.update();
	};
	
    //如果认证了,点击出twitter地址
    /*
	this.onclick = function(e) {
		if(e.ctrlKey && e.which == 1) {
			if(isAuthorized() && tadpole.hover) {
				window.open("http://twitter.com/" + tadpole.name.substring(1));
                return true;
			}
		}
		else if(e.which == 2) {
			//todo:open menu
			e.preventDefault();
            return true;
		}
        return false;
	};
	*/``
    
    //更新
	this.userUpdate = function(tadpoles, angleTargetX, angleTargetY) {
		this.age++;
		
        //旧角度和旧动量
		var prevState = {
			angle: tadpole.angle,
			momentum: tadpole.momentum,
		}
		
		// 定义anglediff(下一次要转的度数) 
        // Angle to targetx and targety (mouse position)
		var anglediff = ((Math.atan2(angleTargetY - tadpole.y, angleTargetX - tadpole.x)) - tadpole.angle);
        
        //将要转的度数投影到-2pi到2pi之间
		while(anglediff < -Math.PI) {
			anglediff += Math.PI * 2;
		}
		while(anglediff > Math.PI) {
			anglediff -= Math.PI * 2;
		}
		
        //平滑转体
		tadpole.angle += anglediff / 5;
		
		// 将蝌蚪的动量朝目标动量逼近
		if(tadpole.targetMomentum != tadpole.momentum) {
			tadpole.momentum += (tadpole.targetMomentum - tadpole.momentum) / 20;
		}
        
        //动量设正
		if(tadpole.momentum < 0) {
			tadpole.momentum = 0;
		}
		
        //changed加上改变角度的3倍加上主机的动量
        //这里以转向来判断主机是否还在更新
		tadpole.changed += Math.abs((prevState.angle - tadpole.angle)*3) + tadpole.momentum;
		
        
        //如果主机更新了
		if(tadpole.changed > 1) {
			this.timeSinceLastServerUpdate = 0;
		}
	};
	
	this.draw = function(context) {
        //不透明度 
        //本opacity方程式是 timeSinceLastServerUpdate 从300到+inf 时 opa从1平滑过渡到0.2的方程式
		var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
        
        /* 
        //显示头像
		if(tadpole.hover) {
			drawIcon(context);
		}
		
        //根据性别设定颜色
		if(tadpole.sex == 0){
			context.fillStyle = 'rgba(255, 181, 197,'+opacity+')';
		}else if(tadpole.sex == 1){
			context.fillStyle = 'rgba(192, 253, 247,'+opacity+')';
		}
		else{
			context.fillStyle = 'rgba(226,219,226,'+opacity+')';
		}
		
        */
        
        context.fillStyle = 'rgba(226,219,226,'+opacity+')';
        
        //投影(发光),6大小的模糊,颜色白色70%透明
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur    = 6;
		context.shadowColor   = 'rgba(255, 255, 255, '+opacity*0.7+')';
		
		//画圆
		context.beginPath();
		context.arc(tadpole.x, tadpole.y, tadpole.size, tadpole.angle + Math.PI * 2.7, tadpole.angle + Math.PI * 1.3, true); 
		
        //画尾巴
		//tadpole.tail.draw(context);
		
		context.closePath();
		context.fill();
		
		context.shadowBlur = 0;
		context.shadowColor   = '';
		
		drawName(context);
		drawMessages(context);
	};
    
	//判断名字是否为twitter账号
	var isAuthorized = function() {
		return tadpole.name.charAt('0') == "@";
	};
	
    //画名字
	var drawName = function(context) {
        
		var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
		context.fillStyle = 'rgba(226,219,226,'+opacity+')';
		context.font = 7 + "px 'proxima-nova-1','proxima-nova-2', arial, sans-serif";
		context.textBaseline = 'hanging';
		var width = context.measureText(tadpole.name).width;
		context.fillText(tadpole.name, tadpole.x - width/2, tadpole.y + 8);
	}
	
	var drawMessages = function(context) {
		tadpole.messages.reverse();
		for(var i = 0, len = tadpole.messages.length; i<len; i++) {
			tadpole.messages[i].draw(context, tadpole.x+10, tadpole.y+5, i);
		}
		tadpole.messages.reverse();
	};
	
    //画头像
	var drawIcon = function(context){
		if('undefined' == typeof tadpole.img || 'undefined' == typeof tadpole.img.src || tadpole.img.src != tadpole.icon){
		    var img= new Image();
		    img.src=tadpole.icon;
		    img.onerror = function(){img.src='/images/default.png';}
		    tadpole.img = img;
		}
		
		if(tadpole.img.complete){
		    var w = tadpole.img.width;
		    var h = tadpole.img.height;
		    var w =w/h >= 1 ? 30 : (30*w)/h;
		    var h = h/w >=1 ? 30 : (30*h)/w;
		    var x = tadpole.x-15; 
		    var y = tadpole.y-38;
		    context.drawImage(tadpole.img, x, y, w, h);
		    context.fillStyle="rgba(0,0,0,0)";  
		    context.strokeStyle="#fff"; 
		    context.linewidth=10; 
		    context.fillRect(x,y,w,h);
		    context.strokeRect(x,y,w,h); 
		    context.closePath();
		}
	};
	
	
    /*
    // 尾巴
	(function() {
		tadpole.tail = new TadpoleTail(tadpole);
	})();
    */
}
