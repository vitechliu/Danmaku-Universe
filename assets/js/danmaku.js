var standardDanmaku = {
    standard_I:{
        
    }
}

var Danmaku = function(model,dSettings) {
    var danmaku = this;
    var model = model;
    this.x = dSettings.x;
    this.y = dSettings.y;
    var die = false;
    
    this.update = function() {
        
    }
    
    this.draw = function() {
        
    }

}
    
/*
update中写碰撞 碰撞中

dSettings

type:
"bullet"子弹
|- shape:
|- |- "rec" 矩形
|- |- |- width
|- |- |- height
|- |- "circle" 圆
|- |- |- radius
|- speedFunc(time) 子弹速度方程
|- x
|- y
|- angleFunc(time) 子弹方向方程
|- damage 伤害
|- 

"beam"激光

effect
    
*/