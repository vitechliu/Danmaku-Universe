var standardAI = {
    enemy_idle:{
        name:"Enemy",
        control:function(tadpole,condition) {
            return;
        },
        vision:0
    },
    enemy_guard:{
        name:"Enemy",
        control:function(tadpole,condition) {
            if (condition.enemyNum>0) {
                var e = condition.closeEnemy;
                tadpole.userUpdate(e.x,e.y,null);
                if (Math.abs(Math.atan2(e.y-tadpole.y,e.x-tadpole.x)-tadpole.angle)< Math.PI/25) tadpole.onFire = true;
                tadpole.timeSinceLastServerUpdate = 0;
            } else {
                tadpole.cease();
            }
            return;
        },
        vision:250
    },
    enemy_floating:{ //随机浮动
        name:"Enemy",
        change:200,
        direction:Math.random()*2*Math.PI,
        control:function(tadpole,condition) {
            if (condition.enemyNum>0) {
                var e = condition.closeEnemy;
                tadpole.userUpdate(e.x,e.y,null);
                //if (Math.abs(Math.atan2(e.y-tadpole.y,e.x-tadpole.x)-tadpole.angle)< Math.PI/25) 
                tadpole.onFire = true;
                tadpole.timeSinceLastServerUpdate = 0;
            } else {
                if (tadpole.age % tadpole.AI.change == 0) {
                    tadpole.AI.direction += 0.5*(Math.random()-0.5)*Math.PI;
                    tadpole.AI.change = Math.floor(randPoint(tadpole.AI.initChange,0.3));
                }
                if(tadpole.speed < tadpole.speedMax) tadpole.motion_add(tadpole.AI.direction,0.5*tadpole.standardAcc);
                tadpole.cease();
                tadpole.userUpdate(0,0,tadpole.speedAngle);
            }
            return;
        },
        vision:250
    },
}

var AI = function(aiSettings) {
    this.vision = aiSettings.vision;
    this.direction = aiSettings.direction;
    this.initChange = aiSettings.change;
    this.change = aiSettings.change;
    
    this.update = aiSettings.control;
}




/*

type

control = function(tadpole,condition) {

}
vision 视野

*/