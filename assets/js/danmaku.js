var standardDanmaku = {
    standard_I:{
        type:"bullet",
        shape:"rec",
        height:1,
        width:3,
        speedFunc:function(time) {
            return 5;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000
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
            this.speedAdd = parameter.speedAdd;
            this.damage = dSettings.damage *= parameter.damageAdd;
            this.color = dSettings.color;
            this.opacity = dSettings.opacity;
        } break;
        default: {} break;
    }
    
    
    this.update = function() {
        danmaku.life++;
        switch(danmaku.type) {
            case "bullet":{
                danmaku.speed = danmaku.speedFunc(danmaku.life)*danmaku.speedAdd;
                danmaku.angle = danmaku.angleFunc(danmaku.defaultAngle,danmaku.life);
                danmaku.x += danmaku.speed * Math.cos(danmaku.angle);
                danmaku.y += danmaku.speed * Math.sin(danmaku.angle);
                
                //console.log(danmaku.angle);
                //碰撞检测部分
                /**/
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
x,y,damageAdd，speedAdd,angle,派别(camp)

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

"beam"激光

effect
    
*/