//Setting.js 部分
var Settings = function() {
    var domain_arr = ['workerman.net'];
    this.socketServer = 'ws://' + domain_arr[Math.floor(Math.random() * domain_arr.length + 1) - 1] + ':8280';
}

var camp = []; //阵营
camp[0] = "user";
camp[1] = "neutral"; //中立 对一切生物中立
camp[2] = "hostile"; //敌对 对一切生物敌对
camp[3] = "friendly"; //友好 常见于无

var campJudge = [];
campJudge[0] = [true,true,false,true];
campJudge[1] = [true,true,false,true];
campJudge[2] = [false,false,false,false];


var App = function(aCanvas) {
    var app = this;
    
    
    window.initEnter = 0; //处理Enter事件和聊天框focus
    var model, canvas, context, messageHandler, mouse = {
        x: 0,
        y: 0,
        worldx: 0,
        worldy: 0,
        tadpole: null
    },
    //全局鼠标事件,tadpole为鼠标指向的主机
    keyNav = {
        x: 0,
        y: 0
    },
    
    messageQuota = 5 //消息限制数量(最高5个，每50帧回复1个)
    ;

    app.update = function() {
        //每隔50帧能发个消息
        if (messageQuota < 5 && model.userTadpole.age % 50 == 0) {
            messageQuota++;
        }

        // 更新主机位置
        var mvp = getMouseWorldPosition();
        mouse.worldx = mvp.x;
        mouse.worldy = mvp.y;
        model.userTadpole.userUpdate(model.tadpoles, mouse.worldx, mouse.worldy);
        
        /*
        if (keyNav.x != 0 || keyNav.y != 0) { //如果键盘有操作
            //键盘
            model.userTadpole.userUpdate(model.tadpoles, model.userTadpole.x + keyNav.x, model.userTadpole.y + keyNav.y);
        } else {
            //鼠标
            var mvp = getMouseWorldPosition();
            mouse.worldx = mvp.x;
            mouse.worldy = mvp.y;
            model.userTadpole.userUpdate(model.tadpoles, mouse.worldx, mouse.worldy);
        }
        */
        
        //待弄懂
        if (model.userTadpole.age % 6 == 0 && model.userTadpole.changed > 1) {
            model.userTadpole.changed = 0;
            //webSocketService.sendUpdate(model.userTadpole);
        }

        //更新镜头
        model.camera.update(model);

        //更新主机
        for (id in model.tadpoles) {
            model.tadpoles[id].update(mouse,model);
        }

        //更新特效
        for (var i = model.effects.length-1;i>=0;i--) {
            model.effects[i].update();
            if(model.effects[i].die) model.effects.splice(i,1);
        }
        
        //更新水粒子
        for (i in model.decoStars) {
            model.decoStars[i].update(model.camera.getOuterBounds(), model.camera.zoom);
        }

        //更新箭头
        for (i in model.arrows) {
            var cameraBounds = model.camera.getBounds();
            var arrow = model.arrows[i];
            arrow.update();
        }
        
        //武器在tadpole.update中更新
    };

    //全局绘制
    app.draw = function() {
        
        //开始画全局物体------------------------
        model.camera.setupContext();

        //绘制水粒子
        for (i in model.decoStars) {
            model.decoStars[i].draw(context);
        }
        
        //绘制特效
        for (i in model.effects) {
            model.effects[i].draw(context);
        }

        //绘制主机
        for (id in model.tadpoles) {
            model.tadpoles[id].draw(context);
        }

        //开始UI层级布置(重置变换矩阵) 将transfrom归为正常以绘制UI
        model.camera.startUILayer();
        
        //开始画UI------------------------------
        
        //绘制箭头
        for (i in model.arrows) {
            model.arrows[i].draw(context, canvas);
        }
        
        context.fillStyle = "#FFFFFF";
		context.fillText("x:"+model.userTadpole.x, 10,100);
        context.fillText("y:"+model.userTadpole.y, 10,115);
        context.fillText("SpeedX:"+model.userTadpole.speedX.toFixed(3), 10,130);
        context.fillText("SpeedY:"+model.userTadpole.speedY.toFixed(3), 10,145);
        context.fillText("Speed:"+model.userTadpole.speed.toFixed(3), 10,160);
        context.fillText("SpeedAngle:"+model.userTadpole.speedAngle, 10,190);
    };
    
/*
//Socket部分
    app.onSocketOpen = function(e) {
        //console.log('Socket opened!', e);
        //FIXIT: Proof of concept. refactor!
        uri = parseUri(document.location) if (uri.queryKey.oauth_token) {
            app.authorize(uri.queryKey.oauth_token, uri.queryKey.oauth_verifier)
        }
        // end of proof of concept code.
    };

    app.onSocketClose = function(e) {
        //console.log('Socket closed!', e);
        webSocketService.connectionClosed();
    };

    app.onSocketMessage = function(e) {
        try {
            var data = JSON.parse(e.data);
            webSocketService.processMessage(data);
        } catch(e) {}
    };
    app.authorize = function(token, verifier) {
        webSocketService.authorize(token, verifier);
    }
*/
    app.sendMessage = function(msg) {

        if (messageQuota > 0) {
            messageQuota--;
            messageHandler.handleMessage(msg);
        }

    }

    

    //单击
    app.mousedown = function(e) {
        mouse.clicking = true; //在点击状态 待弄懂
        if (mouse.tadpole && mouse.tadpole.hover && mouse.tadpole.onclick(e)) {
            //如果点的是其他蝌蚪，就不作操作
            return;
        }
        if (model.userTadpole && e.which == 1) {
            //如果存在己方蝌蚪 同时是左键，就加上动量
            //鼠标左键点击(弹幕)
            model.userTadpole.fire(model);
            
            //model.effects.push(new Effect(standardEffect.particles.large));
            //console.log(model.effects);
        }

    };

    //如果是松开左键,设动量为0
    app.mouseup = function(e) {
        if (model.userTadpole && e.which == 1) {
            model.userTadpole.cease();
        }
    };

    //监控鼠标位置
    app.mousemove = function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    //按键
    app.keydown = function(e) {
        //keyNav为动量方向
        if (e.keyCode == keys.up) {
            //console.log("up");
            model.userTadpole.keyNavY = -1;
            e.preventDefault();
        } else if (e.keyCode == keys.down) {
            //console.log("down");
            model.userTadpole.keyNavY = 1;
            e.preventDefault();
        } else if (e.keyCode == keys.left) {
            //console.log("left");
            model.userTadpole.keyNavX = -1;        e.preventDefault();
        } else if (e.keyCode == keys.right) {
            //console.log("right");
            model.userTadpole.keyNavX = 1;
            e.preventDefault();
        } else if (e.keyCode == keys.enter) {
            //打开聊天框
            window.initEnter = 1;
            $("#chatBox").animate({opacity:"1"});
            $("#infoBox").mCustomScrollbar("update");
            $("#infoBox").mCustomScrollbar("scrollTo","bottom",{scrollInertia:1000});
            $("#chat").focus();
            e.preventDefault();
        }
    };

    //松开按键
    app.keyup = function(e) {
        if (e.keyCode == keys.up || e.keyCode == keys.down) {
            model.userTadpole.keyNavY = 0;
            e.preventDefault();
        } else if (e.keyCode == keys.left || e.keyCode == keys.right) {
            model.userTadpole.keyNavX = 0;
            e.preventDefault();
        }
    };
    
    /*
    //手机端触摸检测
    app.touchstart = function(e) {
        e.preventDefault();
        mouse.clicking = true; //在点击状态 待弄懂
        if (model.userTadpole) {
            model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
        }

        var touch = e.changedTouches.item(0);
        if (touch) {
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }
    }
    app.touchend = function(e) {
        if (model.userTadpole) {
            model.userTadpole.targetMomentum = 0;
        }
    }
    app.touchmove = function(e) {
        e.preventDefault();

        var touch = e.changedTouches.item(0);
        if (touch) {
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }
    }
    
    */
    
    //浏览器窗口变化
    app.resize = function(e) {
        resizeCanvas();
    };
    
    var resizeCanvas = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    /* 
    //设置性别
	app.setsex = function(sex){
		model.userTadpole.sex = sex;
		$.cookie('sex', sex, {expires:14});
	}
	
    
    //设置头像
	app.seticon = function(icon){
		model.userTadpole.icon = icon;
		$.cookie('icon', icon, {expires:14});
	}
    */

    //返回鼠标的全局位置
    var getMouseWorldPosition = function() {
        return {
            x: (mouse.x + (model.camera.x * model.camera.zoom - canvas.width / 2)) / model.camera.zoom,
            y: (mouse.y + (model.camera.y * model.camera.zoom - canvas.height / 2)) / model.camera.zoom
        }
    };
    
   
    // 主初始化
    (function() {
        canvas = aCanvas;
        context = canvas.getContext('2d');
        resizeCanvas();

        model = new Model();
        //model.settings = aSettings;

        model.userTadpole = new Tadpole();
        model.userTadpole.id = -1;
        model.tadpoles[model.userTadpole.id] = model.userTadpole;
        
        model.userTadpole.weapon[1] = new Weapon(standardWeapon.standard_Tripple,model.userTadpole);
        model.userTadpole.camp = camp[0]; //设立阵营
        
        //添加水粒子
        
        model.decoStars = [];
        
        for (var i = 0; i < 400; i++) {
            model.decoStars.push(new DecoStars());
        }
        //添加特效
        model.effects = [];
            
        //镜头初始化
        model.camera = new Camera(canvas, context, model.userTadpole.x, model.userTadpole.y);
        
        //箭头初始化
        model.arrows = {};
        
        //消息处理
        messageHandler = new MessageHandler(model);
        
        
        model.getDistance = function(x1,y1,x2,y2) {
            return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        }
        
        //添加敌人函数(测试)
        
        model.addEnemy = function(AI,x,y,camp,wp) {
            var t = new Tadpole();
            t.AI = AI;
            t.x = x;
            t.y = y;
            t.camp = camp;
            t.weapon[1] = wp;
            model.tadpoles.push(t);
        }
        //model全局判断附近敌人数量
        model.getEnemyNum = function(self,radius,c) {
            var num = -1;
            switch(c) {
                case camp[0]:{ //玩家
                    for (var i in model.tadpoles) 
                        if (model.tadpoles[i].camp == camp[2] && model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=radius) num++;
                    return num;
                } break;
                case camp[2]:{
                    for (var i in model.tadpoles) 
                        if (model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=radius) num++;
                    return num;
                } break;
                default: {return 0;} break;
            }
        };
        
        model.getEnemy = function(self,radius,c) {
            var enemy = [];
            switch(c) {
                case camp[0]:{ //玩家
                    for (var i in model.tadpoles) 
                        if (i!=-1 && model.tadpoles[i].camp == camp[2] && model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=radius) enemy.push(tadpoles[i]);
                    return enemy;
                } break;
                case camp[2]:{
                    for (var i in model.tadpoles) 
                        if (model.tadpoles[i]!= self && model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=radius) enemy.push(tadpoles[i]);
                    return enemy;
                } break;
                default: {return enemy;} break;
            }
        };
        
        model.getCloseEnemy = function(self,c,d) {
            var d = d || 1000;
            var enemy = null;
            switch(c) {
                case camp[0]:{ //玩家
                    for (var i in model.tadpoles) 
                        if (i!=-1 && model.tadpoles[i].camp == camp[2] && model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=d) {
                            d = model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y);
                            enemy = model.tadpoles[i];
                        }
                    return enemy;
                } break;
                case camp[2]:{
                    for (var i in model.tadpoles) 
                        if (model.tadpoles[i]!= self && model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y)<=d) {   
                            d = model.getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles.y);
                            enemy = model.tadpoles[i];
                        }             
                    return enemy;
                } break;
                default: {return enemy;} break;
            }
        }
        
        $(function(){
            
        });
        
        /*
        //websocket部分
        
        webSocket = new WebSocket(model.settings.socketServer);
        webSocket.onopen = app.onSocketOpen;
        webSocket.onclose = app.onSocketClose;
        webSocket.onmessage = app.onSocketMessage;

        webSocketService = new WebSocketService(model, webSocket);
        
        */
    })();
}