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
beam激光

子弹的xy为子弹的中心，如矩形中心，圆形中心等
激光的xy为激光初始点

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
    rec_bullet_II:{ //较长的rec1
        type:"bullet",
        shape:"rec",
        height:1.2,
        width:6,
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
    circle_bullet_II:{ //大型圆子弹 
        type:"bullet",
        shape:"circle",
        size:3,
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
        damage:50,
        blur:2
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
    
    rec_beam_I:{ //激光
        type:"beam",
        shape:"line",
        width:1,
        distance:500,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:false, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    
    rec_beam_II:{ //短激光
        type:"beam",
        shape:"line",
        width:1,
        distance:50,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:false, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    rec_beam_III:{ //激光 可穿透
        type:"beam",
        shape:"line",
        width:1,
        distance:500,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:true, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    
    rec_beam_IV:{ //短激光 可穿透
        type:"beam",
        shape:"line",
        width:1,
        distance:50,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:true, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
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
var cldCircleLine = function(cx,cy,cr,lx1,ly1,lx2,ly2) { //线段与圆碰撞,返回碰撞点
    var a = (lx2-lx1)*(lx2-lx1)+(ly2-ly1)*(ly2-ly1),
        b = 2*((lx2-lx1)*(lx1-cx)+(ly2-ly1)*(ly1-cy)),
        c = (lx1-cx)*(lx1-cx)+(ly1-cy)*(ly1-cy)-cr*cr,
        delta = b*b-4*a*c,
        t0 = -b/(2*a);
    var ans = {};
    if (delta==0 && 0<= t0 && t0<=1) {
        ans.b = true;
        ans.x = (lx2-lx1)*t0+lx1;
        ans.y = (ly2-ly1)*t0+ly1;
    } else {
        if(c*(a+b+c)<0) {
            ans.b = true;
            if (t0<0.5) {
                var t2 = (-b+Math.sqrt(delta))/(2*a);
                ans.x = (lx2-lx1)*t2+lx1;
                ans.y = (ly2-ly1)*t2+ly1;
            } else {
                var t1 = (-b-Math.sqrt(delta))/(2*a);
                ans.x = (lx2-lx1)*t1+lx1;
                ans.y = (ly2-ly1)*t1+ly1;
            }
        } else {
            if (delta>0 && 0<= t0 && t0<=1) { 
                ans.b = true;
                //判断碰撞点
                var t1 = (-b-Math.sqrt(delta))/(2*a),
                    t2 = (-b+Math.sqrt(delta))/(2*a),
                    d1 = getDistance((lx2-lx1)*t1+lx1,(ly2-ly1)*t1+ly1,lx1,ly1),
                    d2 = getDistance((lx2-lx1)*t2+lx1,(ly2-ly1)*t2+ly1,lx1,ly1);
                if (d1<d2) {
                    ans.x = (lx2-lx1)*t1+lx1;
                    ans.y = (ly2-ly1)*t1+ly1;
                } else {
                    ans.x = (lx2-lx1)*t2+lx1;
                    ans.y = (ly2-ly1)*t2+ly1;
                }
            } else {
                ans.b = false;
            }
        }
    }
    return ans;
}

var cldCircleLine_beam = function(tadpole,lx1,ly1,lx2,ly2) { //激光
    return cldCircleLine(tadpole.x,tadpole.y,tadpole.size,lx1,ly1,lx2,ly2);
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
    this.effect = dSettings.effect || standardEffect.particles.small;
    this.blur = dSettings.blur || 0;

    
    function drawRect(x,y,w,h,a,ctx) {
        ctx.beginPath();
        ctx.moveTo(x+0.5*h*Math.sin(a)-0.5*w*Math.cos(a),y-0.5*h*Math.cos(a)-0.5*w*Math.sin(a));
        ctx.lineTo(x-0.5*h*Math.sin(a)-0.5*w*Math.cos(a),y+0.5*h*Math.cos(a)-0.5*w*Math.sin(a));
        ctx.lineTo(x-0.5*h*Math.sin(a)+0.5*w*Math.cos(a),y+0.5*h*Math.cos(a)+0.5*w*Math.sin(a));
        ctx.lineTo(x+0.5*h*Math.sin(a)+0.5*w*Math.cos(a),y-0.5*h*Math.cos(a)+0.5*w*Math.sin(a));
        ctx.closePath();
        ctx.fill();
    }
    
    function drawBeam(x,y,w,h,a,ctx) { //画激光 初始点为激光始发点w实为distance h实为width
        ctx.beginPath();
        ctx.moveTo(x+0.5*h*Math.sin(a),y-0.5*h*Math.cos(a));
        ctx.lineTo(x-0.5*h*Math.sin(a),y+0.5*h*Math.cos(a));
        ctx.lineTo(x-0.5*h*Math.sin(a)+w*Math.cos(a),y+0.5*h*Math.cos(a)+w*Math.sin(a));
        ctx.lineTo(x+0.5*h*Math.sin(a)+w*Math.cos(a),y-0.5*h*Math.cos(a)+w*Math.sin(a));
        ctx.closePath();
        ctx.fill();
    }
    
    function getEndPoint(x,y,d,a) { 
        return {
            x:x+d*Math.cos(a),
            y:y+d*Math.sin(a)
        }
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
                    this.width = dSettings.width;
                    this.distance = dSettings.distance;
                    this.showDistance = dSettings.distance;
                } break;
                default: {} break;
            }
            this.damage = dSettings.damage * this.damageAdd * this.tadpole.damageAdd;;
            this.damageFurtherLower = dSettings.damageFurtherLower;
            this.penetrable = dSettings.penetrable;
            this.color = dSettings.color;
            this.opacity = dSettings.opacity;
            
            this.onHitting = false; //穿透型激光是否击中敌人中
            //待补充
        }
        default: {} break;
    }
    
    //bullet的碰撞检测--------------------------
    function whenCollision(tadpole) { //发生碰撞
        var a = getPEAngle(tadpole,danmaku.x,danmaku.y);
        model.effects.push(new Effect(danmaku.effect,danmaku.x,danmaku.y,a.start,a.end));
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
            if (model.tadpoles[i]!=danmaku.tadpole && !cj(model.tadpoles[i].camp,danmaku.camp) && !model.tadpoles[i].die && getDistance(collisionX,collisionY,model.tadpoles[i].x,model.tadpoles[i].y)<=model.tadpoles[i].size) whenCollision(model.tadpoles[i]);  
        
    }
    //beam的碰撞检测--------------------------
    function whenCollision_beam(tadpole,px,py) { //发生碰撞
        var a = getPEAngle(tadpole,px,py);
        if (Math.random()<0.3) model.effects.push(new Effect(danmaku.effect,px,py,a.start,a.end));
        tadpole.onHit(model,danmaku);
    }
    
    function checkCollision_beam(model) {
        if (!danmaku.penetrable) {
            danmaku.onHitting = false;
            danmaku.distance = danmaku.showDistance;
        }
        switch(danmaku.shape) {
            case "line":{
                var lx1 = danmaku.x,
                    ly1 = danmaku.y,
                    lx2 = getEndPoint(danmaku.x,danmaku.y,danmaku.distance,danmaku.angle).x,
                    ly2 = getEndPoint(danmaku.x,danmaku.y,danmaku.distance,danmaku.angle).y;

                for (var i in model.tadpoles) 
                    if (model.tadpoles[i]!=danmaku.tadpole && !cj(model.tadpoles[i].camp,danmaku.camp && !model.tadpoles[i].die)) {
                        var cld = cldCircleLine_beam(model.tadpoles[i],lx1,ly1,lx2,ly2);
                        if (cld.b) {
                            whenCollision_beam(model.tadpoles[i],cld.x,cld.y);
                            if (!danmaku.penetrable) {
                                danmaku.onHitting = true; 
                                danmaku.distance = 1+getDistance(danmaku.x,danmaku.y,cld.x,cld.y);
                                //console.log(danmaku.die);
                            }
                        }
                    }
            } break;
            default:{
            } break;
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
                
                
                //碰撞检测部分
                checkCollision(model);
                
                /**/
                //屏幕外子弹删除
                if (model.getDistance(danmaku.x,danmaku.y,model.userTadpole.x,model.userTadpole.y)>2000) danmaku.die = true;
                if (danmaku.life == danmaku.maxLife) danmaku.die = true;
            } break;
            case "beam":{
                danmaku.opacity *= 0.8;
                
                checkCollision_beam(model);
                if (danmaku.life == danmaku.maxLife) danmaku.die = true;
            } break;
            default: {} break;
        }
    }
    
    this.draw = function(context) {
        context.save();
        if (danmaku.blur>0) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = danmaku.blur;
            context.shadowColor = danmaku.color+danmaku.opacity*0.7+")";
        }
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
            } break;
            case "beam":{
                switch(danmaku.shape) {
                    case "line":{
                        context.fillStyle = danmaku.color+danmaku.opacity+")";
                        /*激光穿透部分*/
                        drawBeam(danmaku.x,danmaku.y,danmaku.distance,danmaku.width,danmaku.angle,context);
                    } break;
                    default:{} break;
                }
            } break;
            default: {} break;
        }
        context.restore();
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