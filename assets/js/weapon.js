var standardWeapon = {
    standard_I:{
        name:"Standard Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        type:1,
        stdSpeed:3,
        time:40,
        danmaku:standardDanmaku.standard_I
    }
};

var Weapon = function(wSettings) {
    
    //this.x = wSettings.x;
    //this.y = wSettings.y;
    this.danmakuType = wSettings.danmakuType;
    this.danmaku = [];
    this.reloaded = true;
    this.reloadTime = wSettings.time;
    this.time = 0;
    
    this.fire = function(model) {
        console.log("!!");
    }

    this.update = function() {
        
    }
    
    this.draw = function() {
        
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


type 
1 创造子弹型
|- num 一次创造多少danmaku
|- speedAdd 速度加成 默认1

collide 碰撞类型

time 基础攻击间隔
damageAdd 伤害叠加
counterSheild 是否能破盾

effects 击中效果

danmaku 弹幕

icon 缩略图


app的keyDown中 监听 key 并 根据userTadpole武器状态 调用 tadpole.fire(model),调用weapon.fire(model);
weapon.fire中产生为该weapon.danmaku.push(new Danmaku(model,dSettings)); 判断die
*/