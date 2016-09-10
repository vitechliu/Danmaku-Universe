var standardWeapon = {
    standard_I:{
        name:"Standard Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        type:1,
        frequency:10,
        danmakuType:standardDanmaku.standard_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    standard_Tripple:{
        name:"Standard Tripple Laser",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        type:1,
        frequency:22,
        danmakuType:standardDanmaku.standard_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:3,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a+Math.PI*(n-1)/40
            };
        }
    },
    enemy_I:{
        name:"Enemy Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        type:1,
        frequency:240,
        danmakuType:standardDanmaku.standard_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:0.1,
        num:1,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    }
};

var Weapon = function(wSettings,tadpole) {
    
    var weapon = this;
    
    this.x = 0; //update中更新炮口x,y
    this.y = 0;
    this.angle = 0;
    
    this.tadpole = tadpole; //tadpoleID
    this.danmakuType = wSettings.danmakuType;
    this.danmaku = [];
    this.frequency = wSettings.frequency;
    this.time = 0;
    
    this.onFire = false;
    
    var hasSprites = wSettings.hasSprites || false;
    if (hasSprites) this.drawFunc = wSettings.drawFunc;
    
    this.damageAdd = wSettings.damageAdd || 1;
    this.speedAdd = wSettings.speedAdd || 1;
    
    this.num = wSettings.num;
    this.pm = {};
    
    this.pm.damageAdd = this.damageAdd;
    this.pm.speedAdd = this.speedAdd;
    this.pm.camp = tadpole.camp;
    
    this.tadpoleFuncWeapon = wSettings.tadpoleFuncWeapon;
    this.xyaFuncDanmaku = wSettings.xyaFuncDanmaku;
    
    this.fire = function(model) {
        weapon.onFire = true;     
        
    }
    
    this.cease = function() {
        weapon.onFire = false;
    }

    this.update = function(tadpole,model) {
        
        //更新x,y,angle
        var wpm = weapon.tadpoleFuncWeapon(tadpole);
        weapon.x = wpm.x;
        weapon.y = wpm.y;
        weapon.angle = wpm.a;
        
        //发射子弹相关
        weapon.time = (weapon.time == weapon.frequency) ? weapon.frequency : weapon.time+1;
        
        if (weapon.onFire) {
            if (weapon.time == weapon.frequency) {
                weapon.time = 0;
                for (var i=0;i<weapon.num;i++) {
                    var xya = weapon.xyaFuncDanmaku(weapon.x,weapon.y,weapon.angle,i);
                    weapon.pm.x = xya.x;
                    weapon.pm.y = xya.y;
                    weapon.pm.angle = xya.a;
                    weapon.danmaku.push(new Danmaku(model,weapon.danmakuType,weapon.pm));
                }
                
            }
        }
        
        //去除消逝弹幕
        for (var i = weapon.danmaku.length-1;i>=0;i--) {
            weapon.danmaku[i].update(model);
            if(weapon.danmaku[i].die) weapon.danmaku.splice(i,1);
        }
    }
    
    this.draw = function(context) {
        if (hasSprites) weapon.drawFunc(context);
        for (var i in weapon.danmaku) {
            weapon.danmaku[i].draw(context);
        }
    }
}

/*


wSettings

-hasSprites (if true)是否需要独立绘制炮塔素材
|- drawFunc 绘制函数
|- 

name 武器名 如果随机生成 名字也随机生成

isDesigned 是否为玩家设计的
isRandomed 是否为随机生成的

tadpoleFuncWeapon:根据主机的xy,size和angle返回炮口xy和angle
type 
1 创造子弹型
|- num 一次创造多少danmaku
|- speedAdd 速度加成 默认1
|- xyaFuncDanmaku 根据武器的炮口xy和angle和子弹顺序返回子弹xy和angle

collide 碰撞类型

frequency 基础攻击间隔
damageAdd 伤害叠加
counterSheild 是否能破盾

effects 击中效果

danmaku 弹幕

icon 缩略图


app的keyDown中 监听 key 并 根据userTadpole武器状态 调用 tadpole.fire(model),调用weapon.fire(model);
weapon.fire中设onFire =1,weapon.cease 设0，weapon.update中如果onFire且reloaded 产生为该weapon.danmaku.push(new Danmaku(model,dSettings)); 判断die
*/