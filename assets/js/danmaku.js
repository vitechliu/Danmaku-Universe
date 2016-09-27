/*
弹幕命名

moving_shape_type_代号

moving:
减速 slow
减速至不动 slowMine
不动 mine
匀速 无
加速 acc

shape :
矩形rec
圆形circle

type:
bullet子弹

*/
var standardDanmaku = {
    rec_bullet_I:{
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
    },
    rec_bullet_II:{
        type:"bullet",
        shape:"rec",
        height:1.2,
        width:5,
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
        damage:100
    },
    circle_bullet_I:{
        type:"bullet",
        shape:"circle",
        size:1,
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
    },
    slowMine_circle_bullet_I:{ //防御型弹幕 会漂浮不动
        type:"bullet",
        shape:"circle",
        size:1,
        speedFunc:function(time) {
            return 8/time;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1500,
        penetrable:false,
        damage:50
    },
    
    standard_beam_I:{ //激光
        type:"beam",
        shape:"line",
        width:0.3,
        distance:300,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:true, //穿透 待完善
        maxLife:3,
        color:"rgba(255,255,255,",
        opacity:0.9,
        blur:2
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
    this.tadpole = parameter.tadpole;
    
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
                    this.size = dSettings.size;
                } break;
                default: {} break;
            }
            this.speedFunc = dSettings.speedFunc;
            this.angleFunc = dSettings.angleFunc;
            this.speedAdd = parameter.speedAdd || 1;
            this.damage = dSettings.damage * this.damageAdd * this.tadpole.damageAdd;
            this.color = dSettings.color;
            this.opacity = dSettings.opacity;
            this.penetrable = dSettings.penetrable;
        } break;
        case "beam": {
            this.shape = dSettings.shape;
            switch(this.shape) {
                case "line":{
                    this.width = dSettings.width();
                    this.distance = dSettings.distance();
                } break;
                default: {} break;
            }
            this.damage = dSettings.damage;
            this.damageFurtherLower = dSettings.damageFurtherLower;
            this.penetrable = dSettings.penetrable;
            //待补充
        }
        default: {} break;
    }
    
    function whenCollision(tadpole) { //发生碰撞
        var a = getPEAngle(tadpole,danmaku.x,danmaku.y);
        model.effects.push(new Effect(standardEffect.particles.small,danmaku.x,danmaku.y,a.start,a.end));
        if(!danmaku.penetrable) danmaku.die = true;
        tadpole.onHit(model,danmaku);
    }
    
    function checkCollision(model) {
        var collisionX;
        var collisionY;
        switch(danmaku.shape) {
            case "rec":{
                collisionX = danmaku.x+0.5*danmaku.width*Math.cos(danmaku.angle)-0.5*danmaku.height*Math.sin(danmaku.angle);
                collisionY = danmaku.y+0.5*danmaku.width*Math.sin(danmaku.angle)-0.5*danmaku.height*Math.cos(danmaku.angle);
            } break;
            case "circle":{
                collisionX = danmaku.x;
                collisionY = danmaku.y;
            } break;
            default:{
                collisionX = danmaku.x;
                collisionY = danmaku.y;
            } break;
        } 
        for (var i in model.tadpoles) 
            if (model.tadpoles[i]!=danmaku.tadpole && !cj(model.tadpoles[i].camp,danmaku.camp) && getDistance(collisionX,collisionY,model.tadpoles[i].x,model.tadpoles[i].y)<=model.tadpoles[i].size) whenCollision(model.tadpoles[i]);  
        
    }
    
    this.update = function(model) {
        danmaku.life++;
        switch(danmaku.type) {
            case "bullet":{
                danmaku.speed = danmaku.speedFunc(danmaku.life)*danmaku.speedAdd;
                danmaku.angle = danmaku.angleFunc(danmaku.defaultAngle,danmaku.life);
                danmaku.x += danmaku.speed * Math.cos(danmaku.angle);
                danmaku.y += danmaku.speed * Math.sin(danmaku.angle);
                
                
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
                    case "circle": {
                        context.fillStyle = danmaku.color+danmaku.opacity+")";
                        context.beginPath();
                        context.arc(danmaku.x,danmaku.y,danmaku.size,0,2*Math.PI);
                        context.closePath();
                        context.fill();
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
|- |- "other" 自定义
|- speedFunc(time) 子弹速度方程
|- angleFunc(time) 子弹方向方程
|- damage 伤害
|- maxLife 生存时间
|- penetrable 穿透

"beam"激光

effect
    
*/