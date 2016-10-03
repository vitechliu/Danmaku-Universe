//全局设定
var Settings = {
    ENEMY_CLEAR_DISTANCE:5000
}

//阵营
var camp = []; 
camp[0] = "user";
camp[1] = "neutral"; //中立 对一切生物中立
camp[2] = "hostile"; //敌对 对一切生物敌对
camp[3] = "friendly"; //友好 对一切生物友好

camp[4] = "ionizer"; //解离者 主要敌人 
camp[5] = ""

var cjArr = [];
cjArr[0] = [true,true,false,true,false];
cjArr[1] = [true,true,false,true,true];
cjArr[2] = [false,false,false,false,false];
cjArr[3] = [true,true,true,true,true];

cjArr[4] = [false,true,false,true,true];

var cj = function (camp1,camp2) { //CampJudge
    
    var c1 = $.inArray(camp1,camp),
        c2 = $.inArray(camp2,camp);
    return cjArr[c1][c2];
}

var getDistance = function(x1,y1,x2,y2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

var App = function(aCanvas) {
    var app = this;
    this.time = 0;
    
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
    
    messageQuota = 5; //消息限制数量(最高5个，每50帧回复1个)



    app.update = function() {
        stats.begin();
        
        app.time++;
        //更新UI！！
        $("#hpBar").css("width",Math.floor(197*model.userTadpole.hp/model.userTadpole.hpmx)+"px");
        $("#hpBarText").text("Hp: "+model.userTadpole.hp.toFixed(1)+" / "+model.userTadpole.hpmx);
        $("#expBar").css("width",Math.floor(197*model.userTadpole.exp/tadpoleExp[model.userTadpole.level+1])+"px");
        $("#expBarText").text("Exp: "+model.userTadpole.exp+" / "+tadpoleExp[model.userTadpole.level+1]);
        
        var statusText = "";
        statusText += "<i class=\"fa fa-fw\"></i>Level: "+model.userTadpole.level+"<br>";
        statusText += "<i class=\"fa fa-fw\"></i>Position:  ("+model.userTadpole.x.toFixed(1)+",";
        statusText += model.userTadpole.y.toFixed(1)+")<br>";
        statusText += "<i class=\"fa fa-fw\"></i>Speed: "+model.userTadpole.speed.toFixed(1)+"<br>";
        statusText += "<i class=\"fa fa-fw\"></i>Speed: "+model.userTadpole.shield.status+"<br>";
        statusText += "<i class=\"fa fa-fw\"></i>Speed: "+model.userTadpole.shield.hp+"<br>";
        
        $("#selfStatusText").html(statusText);
        
        
        
        //----
        //每隔50帧能发个消息
        if (messageQuota < 5 && model.userTadpole.age % 50 == 0) {
            messageQuota++;
        }

        // 更新主机位置
        var mvp = getMouseWorldPosition();
        mouse.worldx = mvp.x;
        mouse.worldy = mvp.y;
        model.userTadpole.userUpdate(mouse.worldx, mouse.worldy,null);
        
        if (model.userTadpole.age % 6 == 0 && model.userTadpole.changed > 1) {
            model.userTadpole.changed = 0;
        }

        //更新镜头
        model.camera.update(model);

        //更新主机
        model.userTadpole.update(mouse,model);
        
        //更新箭头
        for (i in model.arrows) {
            var cameraBounds = model.camera.getBounds();
            var arrow = model.arrows[i];
            arrow.update();
        }
        
        //更新其他机体
        for (var i = model.tadpoles.length-1;i>=0;i--) {
            model.tadpoles[i].update(mouse,model);
            if(model.tadpoles[i].die) {
                model.tadpoles.splice(i,1);
                model.arrows.splice(i,1);
            }
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
        
        //更新弹出消息
        model.noticeHandler.update();

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
        
        /*
        context.save();
        context.font="14px FontAwesome";
        context.fillStyle="rgba(255,255,255,.9)";
        var txt = "\uf036"  
        context.fillText(txt,100,100);
        context.restore();     
        
        */
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
            model.userTadpole.onFire = true;
            
            //model.effects.push(new Effect(standardEffect.particles.large));
            //console.log(model.effects);
        }

    };

    //如果是松开左键,设动量为0
    app.mouseup = function(e) {
        if (model.userTadpole && e.which == 1) {
            model.userTadpole.cease();
        }
        model.userTadpole.expGain(20,model);
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
            model.userTadpole.keyNavY = -1;
            e.preventDefault();
        } else if (e.keyCode == keys.down) {
            model.userTadpole.keyNavY = 1;
            e.preventDefault();
        } else if (e.keyCode == keys.left) {
            model.userTadpole.keyNavX = -1;        e.preventDefault();
        } else if (e.keyCode == keys.right) {
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
        //资源
        model.source = new Source();
        
        
        //主机设定与添加
        var userT = {};
        userT.camp = camp[0];
        userT.hpRegen = 0.01;
        model.userTadpole = new Tadpole(userT);
        model.userTadpole.id = -1;
        model.userTadpole.shield = new Shield(standardShield.standard_I,model.userTadpole);
        model.userTadpole.equip(new Weapon(standardWeapon.beam_I,model.userTadpole),1,model);
        model.tadpoles[model.userTadpole.id] = model.userTadpole;
        
        //初始化UI
        //$("#weaponBox3").hide();
        //$("#weaponBox4").hide();

        //UI完善主机武器1
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
        model.arrows = [];
        
        //对话框消息处理
        messageHandler = new MessageHandler(model);
        
        //弹出消息处理
        model.noticeHandler = new NoticeHandler(model);
        
        model.noticeHandler.pushNotice("asdasd",500);
        model.noticeHandler.pushNotice("123",500);
        
        model.getDistance = function(x1,y1,x2,y2) {
            return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        }
        
        //添加敌人函数(测试)
        
        model.addEnemy = function(settings,wp,name) {
            var t = new Tadpole(settings);
            if (wp!=null) t.equip(new Weapon(wp,t),1,model);
            model.tadpoles.push(t);
            model.arrows[$.inArray(t,model.tadpoles)] = new Arrow(t, model.camera);
        }
        
        
        //----------------
        var st = {};
        st.x = 0;
        st.y = 0;
        st.AI = new AI(standardAI.enemy_floating);
        st.name = "testFloating";
        st.camp = camp[4];
        st.isLeader = true;
        st.speedMax = 1;
        st.standardAcc = 0.25;
        st.friction =0.05;
        
        model.addEnemy(st,standardWeapon.short_beam_I,"testGuard");
        //----------------
        //model全局判断附近敌人数量
        model.getEnemyNum = function(self,radius) {
            
            var radius = radius || 1000;
            var num = 0;
            for (var i in model.tadpoles) 
                if (!cj(model.tadpoles[i].camp,self.camp) && model.tadpoles[i]!=self && getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles[i].y)<=radius) {
                    num++;
                }
            return num;

        };
        model.userAddWeaponSlot = function() {
            model.userTadpole.weaponSlot ++;
            if(model.userTadpole.weaponSlot == 3) $("#weaponBox3").show();
            if(model.userTadpole.weaponSlot == 4) $("#weaponBox4").show();
        }
        model.getEnemy = function(self,radius) {
            var enemy = [];
            for (var i in model.tadpoles) 
                if (!cj(model.tadpoles[i].camp,self.camp) && model.tadpoles[i]!=self && getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles[i].y)<=radius)
                    enemy.push(model.tadpoles[i]);
            return enemy;
        };
        
        model.getCloseEnemy = function(self,d) {
            var d = d || 1000;
            var enemy = null;
            for (var i in model.tadpoles) 
                if (!cj(model.tadpoles[i].camp,self.camp) && model.tadpoles[i]!=self && getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles[i].y)<=d)
                    enemy = model.tadpoles[i];
            return enemy;
        };
        
        model.getFollowingTadpole = function(self,d) {
            var d = d || 1000;
            var follow = null;
            for (var i in model.tadpoles) 
                if (model.tadpoles[i].isLeader && model.tadpoles[i].camp == self.camp && model.tadpoles[i]!=self && getDistance(self.x,self.y,model.tadpoles[i].x,model.tadpoles[i].y)<=d)
                    follow = model.tadpoles[i];
            return follow;
        };
        
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