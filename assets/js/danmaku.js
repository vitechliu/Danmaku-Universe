var standardDanmaku = {
    standard_I:{
        type:"bullet",
        shape:"rec",
        height:1,
        width:3,
        speedFunc:function(time) {
            return 8;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000,
        penetrable:false,
        damage:50
    }
}

//碰撞检测!!
var cldPointCircle = function(px,py,cx,cy,cr) {
    if (Math.sqrt((px-cx)*(px-cx)+(py-cy)*(py-cy))<cr) return true;
    else return false;
}
var cldCircleCircle = function(cx1,cy1,cr1,cx2,cy2,cr2) {
    if (Math.sqrt((cx1-cx2)*(cx1-cx2)+(cy1-cy2)*(cy1-cy2))<cr1+cr2) return true;
    else return false;
}
var cldPointRectangle = function(px,py,rx,ry,rw,rh,ra) { //矩形x,y指中心点 待完善
    if (true) return true;
    else return false;
}
var getPEAngle = function(tadpole,x,y) { //返回粒子特效角度
    var a = Math.atan2(y-tadpole.y,x-tadpole.x);
    return {
        start:a-Math.PI/8,
        end:a+Math.PI/8
    }
}

var Danmaku = function(model,dSettings,parameter) {
    //model 弹幕类型 弹幕参数
    var danmaku = this;
    var model = model;
    this.x = parameter.x;
    this.y = parameter.y;
    this.angle = this.defaultAngle = parameter.angle;
    this.die = false;
    this.type = dSettings.type;
    this.maxLife = dSettings.maxLife;
    this.life = 0;
    this.damageAdd = parameter.damageAdd || 1;
    this.camp = parameter.camp;
    
    function drawRect(x,y,w,h,a,ctx) {
        ctx.beginPath();
        ctx.moveTo(x+0.5*h*Math.sin(a)-0.5*w*Math.cos(a),y-0.5*h*Math.cos(a)-0.5*w*Math.sin(a));
        ctx.lineTo(x-0.5*h*Math.sin(a)-0.5*w*Math.cos(a),y+0.5*h*Math.cos(a)-0.5*w*Math.sin(a));
        ctx.lineTo(x-0.5*h*Math.sin(a)+0.5*w*Math.cos(a),y+0.5*h*Math.cos(a)+0.5*w*Math.sin(a));
        ctx.lineTo(x+0.5*h*Math.sin(a)+0.5*w*Math.cos(a),y-0.5*h*Math.cos(a)+0.5*w*Math.sin(a));
        ctx.closePath();
        ctx.fill();
    }
    
    switch(this.type) {
        case "bullet": {
            this.shape = dSettings.shape;
            switch(this.shape) {
                case "rec": {
                    this.width = dSettings.width;
                    this.height = dSettings.height;
                } break;
                case "circle": {
                    this.size = dSettings.height;
                } break;
                default: {} break;
            }
            this.speedFunc = dSettings.speedFunc;
            this.angleFunc = dSettings.angleFunc;
            this.speedAdd = parameter.speedAdd || 1;
            this.damage = dSettings.damage * this.damageAdd;
            this.color = dSettings.color;
            this.opacity = dSettings.opacity;
            this.penetrable = dSettings.penetrable;
        } break;
        default: {} break;
    }
    
    function whenCollision(tadpole) { //发生碰撞
        tadpole.hp-= danmaku.damage;
        var a = getPEAngle(tadpole,danmaku.x,danmaku.y);
        model.effects.push(new Effect(standardEffect.particles.small,danmaku.x,danmaku.y,a.start,a.end));
        if(!danmaku.penetrable) danmaku.die = true;
        tadpole.onHit();
    }
    
    function checkCollision(model) {
        var collisionX = danmaku.x+0.5*danmaku.width*Math.cos(danmaku.angle)-0.5*danmaku.height*Math.sin(danmaku.angle);
        var collisionY = danmaku.y+0.5*danmaku.width*Math.sin(danmaku.angle)-0.5*danmaku.height*Math.cos(danmaku.angle);
        switch(danmaku.camp) {
            case camp[0]:{ //玩家
            for (var i in model.tadpoles) 
                if (i!=-1 && model.tadpoles[i].camp == camp[2] && model.getDistance(collisionX,collisionY,model.tadpoles[i].x,model.tadpoles[i].y)<=model.tadpoles[i].size) whenCollision(model.tadpoles[i]);  
            } break;
            case camp[2]:{
                for (var i in model.tadpoles) 
                    if (model.tadpoles[i]!= model.tadpoles && model.getDistance(collisionX,collisionY,model.tadpoles[i].x,model.tadpoles[i].y)<=model.tadpoles[i].size) whenCollision(model.tadpoles[i]);  
            } break;
            default: {} break;
        }
    }
    
    this.update = function(model) {
        danmaku.life++;
        switch(danmaku.type) {
            case "bullet":{
                danmaku.speed = danmaku.speedFunc(danmaku.life)*danmaku.speedAdd;
                danmaku.angle = danmaku.angleFunc(danmaku.defaultAngle,danmaku.life);
                danmaku.x += danmaku.speed * Math.cos(danmaku.angle);
                danmaku.y += danmaku.speed * Math.sin(danmaku.angle);
                
                
                //console.log(danmaku.angle);
                //碰撞检测部分
                checkCollision(model);
                
                /**/
                //屏幕外子弹删除
                if (model.getDistance(danmaku.x,danmaku.y,model.userTadpole.x,model.userTadpole.y)>2000) danmaku.die = true;
                if (danmaku.life == danmaku.maxLife) danmaku.die = true;
            } break;
            default: {} break;
        }
    }
    
    this.draw = function(context) {
        switch(danmaku.type) {
            case "bullet":{
                switch(danmaku.shape) {
                    case "rec": {
                        context.fillStyle = danmaku.color+danmaku.opacity+")";
                        drawRect(danmaku.x,danmaku.y,danmaku.width,danmaku.height,danmaku.angle,context);
                    } break;
                    default: {} break;
                }
                
                if (danmaku.life == danmaku.maxLife) danmaku.die = true;
            } break;
            default: {} break;
        }
    }

}
    
/*
update中写碰撞 碰撞中

[parameter]
x,y,damageAdd，speedAdd,angle,camp

[dSettings]

x
y
angle

type:
"bullet"子弹
|- shape:
|- |- "rec" 矩形
|- |- |- width
|- |- |- height
|- |- "circle" 圆
|- |- |- radius
|- speedFunc(time) 子弹速度方程
|- angleFunc(time) 子弹方向方程
|- damage 伤害
|- maxLife 生存时间
|- penetrable 穿透

"beam"激光

effect
    
*/