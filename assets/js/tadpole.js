//经验数组
var tadpoleExp = [];
tadpoleExp[0] = 0;
tadpoleExp[1] = 0;
for (var i=2;i<100;i++) {
    tadpoleExp[i] = (i-1)*(i-1)*50;
}


var Tadpole = function(tSettings) {
    var tadpole = this;

    //全局属性-----------------------------------------------------
    this.hpmx = tSettings.hp || 1000;
    this.hp = tSettings.hp || 1000;
    this.hpRegen = tSettings.hpRegen || 0;
    this.die = false;
    this.camp = tSettings.camp || camp[1];
    
    this.level = tSettings.level || 1;
    this.exp = tadpoleExp[this.level];
    
    this.shield = tSettings.shield || null;
        
    this.damageAdd = 0.2*this.level+0.8;  
    
    //AI
    this.AI = tSettings.AI || null;

    //初始位置随机 300*300矩形内
    this.x = tSettings.x || Math.random() * 300 - 150;
    this.y = tSettings.y || Math.random() * 300 - 150;
    this.z = 100; //频道
    //圆的半径
    this.size = tSettings.size || 6; //碰撞半径
    this.drawSize = this.size; //绘制半径 不变
    
    //默认主炮塔绘制参数
    this.headSize = tSettings.headSize || 2;
    this.headAngle = tSettings.headAngle || Math.PI * 0.14;
    this.headDistance = tSettings.headDistance || 1.5;

    this.name = tSettings.name || "";
    this.age = 0;
    //this.sex = -1;
    //this.icon = '/images/default.png'; //头像
    //this.img = {};
    //是否有鼠标经过
    this.hover = false;

    //主机炮塔朝向(与鼠标一致)
    this.angle = Math.PI * 2;
    //武器
    this.weapon = [];
    this.weapon[1] = null;
    this.weapon[2] = null;
    this.weapon[3] = null;
    this.weapon[4] = null;

    //武器是否激活
    this.weaponActivated = [];
    this.weaponActivated[1] = true;
    this.weaponActivated[2] = true;
    this.weaponActivated[3] = true;
    this.weaponActivated[4] = true;

    //开放武器槽
    this.weaponSlot = 2;

    //主机转体速度 (>1) 越小越快
    this.turningSpeed = 5;

    this.speed = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.speedAngle = 0; //全局速度方向
    this.addAngle = 0; //加速时加速的方向
    this.speedMax = tSettings.speedMax || 3; // 最大速度
    this.friction = tSettings.friction || 0.15; // 摩擦力
    this.standardAcc = tSettings.standardAcc || 0.45; // 驱动加速度
    this.keyNavX = 0;
    this.keyNavY = 0;

    //是否纯键盘控制
    this.noMouse = 0;

    //消息
    this.messages = [];

    //是否处于开火状态
    this.onFire = false;

    //不活动时间
    //this.timeSinceLastActivity = 0;
    //是否改变
    this.changed = 0;

    function motion_add(dir, speed) {
        tadpole.speedX += speed * Math.cos(dir);
        tadpole.speedY += speed * Math.sin(dir);
        tadpole.speed = Math.sqrt(tadpole.speedX * tadpole.speedX + tadpole.speedY * tadpole.speedY);
    }

    this.motion_add = motion_add;

    function motion_set(dir, speed) {
        tadpole.speed = speed;
        tadpole.speedX = speed * Math.cos(dir);
        tadpole.speedY = speed * Math.sin(dir);
    }
    this.motion_set = motion_set;
    //无服务器加载时间
    this.timeSinceLastServerUpdate = 0;
    
    
    //武器部分------------------------------------------------------
    this.unEquip = function (slot,model) {
        tadpole.weapon[slot] = null;
        if(tadpole == model.userTadpole) {
            var query1 = "#weaponBox"+slot+" img";
            var query2_1 = "#weaponData"+slot+"-1";
            var query2_2 = "#weaponData"+slot+"-2";
            var query2_3 = "#weaponData"+slot+"-3";
            $(query2_1).html("");
            $(query2_2).html("");
            $(query2_3).html("");
            $(query1).attr("src",model.source.image["none"].src);
        }
        //
    }
    this.equip = function(wp,slot,model) {
        if (typeof wp.danmakuType == undefined) {
            throw "Not a valid weapon";
            return;
        }
        if(tadpole == model.userTadpole) {
            wp.slot = slot;
            var query1 = "#weaponBox"+slot+" img";
            var query2_1 = "#weaponData"+slot+"-1";
            var query2_2 = "#weaponData"+slot+"-2";
            var query2_3 = "#weaponData"+slot+"-3";
            var txt = "<strong>&nbsp;"+wp.name + "</strong><br>";
            $(query2_1).html(txt);
            txt = "<i class=\"fa fa-fw\"></i>" +wp.damageAdd*wp.danmakuType.damage+"<br>";
            txt += "<i class=\"fa fa-fw\"></i>" +wp.frequency+"<br>";
            $(query2_2).html(txt);
            txt = "<i class=\"fa fa-fw\"></i>" +wp.price+"<br>";
            txt += "<i class=\"fa fa-fw\"></i>" +wp.danmakuType.type+"<br>";
            $(query2_3).html(txt);
            $(query1).attr("src",model.source.image[wp.name].src);
        }
        tadpole.weapon[slot] = wp;
    }
    this.fire = function(model) {
        for (var i = 1; i < tadpole.weaponSlot + 1; i++) {
            
            if (tadpole.weapon[i] != null && tadpole.weaponActivated[i]) tadpole.weapon[i].fire(model);
        }
        tadpole.timeSinceLastServerUpdate = 0;
    };

    this.cease = function() {
        tadpole.onFire = false;
        for (var i = 1; i < tadpole.weaponSlot + 1; i++) {
            if (tadpole.weapon[i] != null) tadpole.weapon[i].cease();
        }
    };
    
    
    //更新-----------------------------------------------
    this.update = function(mouse, model) {
        tadpole.timeSinceLastServerUpdate++;

        tadpole.age++;
        
        //AIupdate
        if (tadpole.AI != null) {
            var condition = {};
            condition.enemyNum = model.getEnemyNum(tadpole, tadpole.AI.vision);
            condition.closeEnemy = model.getCloseEnemy(tadpole, tadpole.AI.vision);
            tadpole.AI.update(tadpole, condition);
        }

        //--------------物理引擎开始--------------
        //更新位置
        tadpole.x += tadpole.speedX;
        tadpole.y += tadpole.speedY;

        if (tadpole.AI == null && tadpole.speed < tadpole.speedMax) {
            if (tadpole.keyNavX != 0 || tadpole.keyNavY != 0) {
                tadpole.addAngle = Math.atan2(tadpole.keyNavY, tadpole.keyNavX);
                motion_add(tadpole.addAngle, tadpole.standardAcc);
            }
        }

        //处理摩擦力
        if (tadpole.speed > 0 && (Math.abs(tadpole.speedX) > 0 || Math.abs(tadpole.speedY) > 0)) {
            tadpole.speedAngle = Math.atan2(tadpole.speedY, tadpole.speedX);
            if ((tadpole.keyNavX == 0 && tadpole.keyNavY == 0) && tadpole.speed * (tadpole.speed - tadpole.friction) <= 0) motion_set(0, 0);
            else motion_add(tadpole.speedAngle, -tadpole.friction);

            tadpole.timeSinceLastServerUpdate = 0;
        }

        //--------------物理引擎结束--------------
        //更新消息队列
        //负向更新才能splice!!!
        for (var i = tadpole.messages.length - 1; i >= 0; i--) {
            var msg = tadpole.messages[i];
            msg.update();

            if (msg.age == msg.maxAge) {
                tadpole.messages.splice(i, 1);
            }
        }

        // 如果鼠标悬浮在主机上，就把hover为true，同时更新mouse.tadpole
        if (Math.sqrt(Math.pow(tadpole.x - mouse.worldx, 2) + Math.pow(tadpole.y - mouse.worldy, 2)) < tadpole.size + 2) {
            tadpole.hover = true;
            mouse.tadpole = tadpole;
        } else {
            //否则置hover为false
            tadpole.hover = false;
        }

        //更新尾巴
        //tadpole.tail.update();
        
        //更新武器
        for (var i = 1; i < tadpole.weaponSlot + 1; i++) {
            if (tadpole.weapon[i] != null) tadpole.weapon[i].update(tadpole, model);
        }
        
        //更新护盾
        if (tadpole.shield!=null) tadpole.shield.update();
        
        //开火
        if (tadpole.onFire) tadpole.fire(model);

        //回复血量
        tadpole.hp += (tadpole.hp<tadpole.hpmx) ? tadpole.hpRegen : 0;
        
        //更新主机判定体积
        if (tadpole.shield!=null && tadpole.shield.status == 2) tadpole.size = tadpole.shield.size;
        else tadpole.size = tSettings.size || 6;
    };

    //如果认证了,点击出twitter地址
    this.onclick = function(e) {
        /*
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
        */
        return false;
    };

    //更新朝向(过渡)
    this.userUpdate = function(angleTargetX, angleTargetY, angleTarget) {
        var prevState = {
            angle: tadpole.angle,
        }
        
        if (angleTarget == null) {
            // 定义anglediff(下一次要转的度数) 
            // Angle to targetx and targety (mouse position)
            var anglediff = ((Math.atan2(angleTargetY - tadpole.y, angleTargetX - tadpole.x)) - tadpole.angle);
        } else {
            var anglediff = angleTarget - tadpole.angle;
        }
        
        //将要转的度数投影到-2pi到2pi之间
        while (anglediff < -Math.PI) {
            anglediff += Math.PI * 2;
        }
        while (anglediff > Math.PI) {
            anglediff -= Math.PI * 2;
        }

        //平滑转体
        tadpole.angle += anglediff / tadpole.turningSpeed;

        //changed加上改变角度的3倍加上主机的动量
        //这里以转向来判断主机是否还在更新
        tadpole.changed += Math.abs((prevState.angle - tadpole.angle) * 3) + tadpole.speed;

        //如果主机更新了
        if (tadpole.changed > 1) {
            this.timeSinceLastServerUpdate = 0;
        }
    };

    this.draw = function(context) {
        //不透明度 
        //本opacity方程式是 timeSinceLastServerUpdate 从300到+inf 时 opa从1平滑过渡到0.2的方程式
        var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate - 300, 1), 1), .2).toFixed(2);

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
        context.save();
        context.fillStyle = 'rgba(226,219,226,' + opacity + ')';

        //投影(发光),6大小的模糊,颜色白色70%透明
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 6;
        context.shadowColor = getCampColor() + opacity * 0.7 + ')';

        //画圆
        context.beginPath();
        context.arc(tadpole.x, tadpole.y, tadpole.drawSize, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        //画三角头
        context.beginPath();

        context.moveTo(tadpole.x + (tadpole.drawSize + tadpole.headDistance + tadpole.headSize) * Math.cos(tadpole.angle), tadpole.y + (tadpole.drawSize + tadpole.headDistance + tadpole.headSize) * Math.sin(tadpole.angle));
        context.lineTo(tadpole.x + (tadpole.drawSize + tadpole.headDistance) * Math.cos(tadpole.angle - tadpole.headAngle), tadpole.y + (tadpole.drawSize + tadpole.headDistance) * Math.sin(tadpole.angle - tadpole.headAngle));
        context.lineTo(tadpole.x + (tadpole.drawSize + tadpole.headDistance) * Math.cos(tadpole.angle + tadpole.headAngle), tadpole.y + (tadpole.drawSize + tadpole.headDistance) * Math.sin(tadpole.angle + tadpole.headAngle));

        context.closePath();
        context.fill();

        //画尾巴
        //tadpole.tail.draw(context);
        context.restore();
        
        //画武器
        for (var i = 1; i < tadpole.weaponSlot + 1; i++) {
            if (tadpole.weapon[i] != null) tadpole.weapon[i].draw(context);
        }
        
        //画护盾
        if (tadpole.shield!=null && tadpole.shield.status != 0) tadpole.shield.draw(context);

        drawName(context);
        drawMessages(context);
        drawHp(context);
    };

    this.onDeath = function(model) {
        model.effects.push(new Effect(standardEffect.particles.large, tadpole.x, tadpole.y, 0, Math.PI * 2));
    }

    this.onHit = function(model,danmaku) {
        if(tadpole.AI!=null) {
            tadpole.AI.target = danmaku.tadpole; //仇恨
            tadpole.AI.status = 2;
        }
        tadpole.timeSinceLastServerUpdate = 0;
        if (tadpole.shield!=null && tadpole.shield.status == 2) tadpole.shield.onHit(danmaku.damage);
        else tadpole.hp -= danmaku.damage;
        if (tadpole.hp <= 0) {
            tadpole.hp = 0;
            tadpole.die = true;
            danmaku.tadpole.expGain(Math.floor(tadpole.exp * 0.2),model);
            tadpole.onDeath(model);
        }
    }
    
    //经验
    this.expGain = function(exp,model) {
        function ef(x,y) {
            model.effects.push(new Effect(standardEffect.ring.large_out,x,y));
            model.effects.push(new Effect(standardEffect.ring.small_out,x,y));
        }
        function ef2(x,y){
            model.effects.push(new Effect(standardEffect.particles.medium,x,y,0,Math.PI*2));
        }
        
        tadpole.exp += exp;
        var i=tadpole.level+1;
        while (tadpole.exp >= tadpoleExp[i]) {
            if (tadpole.exp < tadpoleExp[i+1]) {
                tadpole.level = i;
                model.effects.push(new Effect(standardEffect.ring.medium_out,tadpole.x,tadpole.y));
                var x = tadpole.x;
                var y = tadpole.y;
                setTimeout(function(){ef(x,y);},200);
                setTimeout(function(){ef2(x,y);},500);
                
                return;
            } 
            i++;
            if (i==100) {
                tadpole.level = 100; 
                return;
            }
        }
        return;
    }
    
    //画名字
    var getCampColor = function() {
        switch (tadpole.camp) {
        case camp[0]:
            {
                return "rgba(255,255,255,";
            }
            break;
        case camp[2]:
            {
                return "rgba(255,100,100,"
            }
            break;
        }
    }
    var drawHp = function(context) {
        context.save();
        context.strokeStyle = getCampColor() + "0.6)";
        context.fillStyle = getCampColor() + "1)";
        context.strokeRect(tadpole.x - tadpole.drawSize * 2.4, tadpole.y - tadpole.drawSize * 2.2, tadpole.drawSize * 4.8, tadpole.drawSize / 3);
        var percent = (tadpole.hp / tadpole.hpmx).toFixed(3);
        context.fillRect(tadpole.x - tadpole.drawSize * 2.4, tadpole.y - tadpole.drawSize * 2.2, percent * tadpole.drawSize * 4.8, tadpole.drawSize / 3);
        context.restore();
    }
    var drawName = function(context) {
        context.save();
        var txt = tadpole.name;
        var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate - 300, 1), 1), .2).toFixed(3);
        context.fillStyle = 'rgba(226,219,226,' + opacity + ')';
        context.font = 7 + "px '微软雅黑',微软雅黑,'Microsoft YaHei','Microsoft Yahei', arial, sans-serif";
        context.textBaseline = 'hanging';
        var width = context.measureText(txt).width;
        context.fillText(txt, tadpole.x - width / 2, tadpole.y + 8);
        context.restore();
    }

    var drawMessages = function(context) {
        tadpole.messages.reverse();
        for (var i = 0,
        len = tadpole.messages.length; i < len; i++) {
            tadpole.messages[i].draw(context, tadpole.x + 10, tadpole.y + 5, i);
        }
        tadpole.messages.reverse();
    };
    
    
    /*
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
	

    // 尾巴
	(function() {
		tadpole.tail = new TadpoleTail(tadpole);
	})();
    */
}