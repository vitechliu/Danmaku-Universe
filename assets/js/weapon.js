var standardWeapon = {
    standard:{
        name:"Standard Laser",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        type:1,
        
    }
};

var Weapon = function(wSettings) {
    
    this.x = dSettings.x;
    this.y = dSettings.y;
    
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
1 子弹类武器
2 激光类武器
3 区域伤害型武器

time 攻击间隔

danmaku 弹幕

icon 缩略图

*/