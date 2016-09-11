var standardAI = {
    enemy_idle: { //完全不动的敌人
        name: "Enemy",
        control: function(tadpole, condition) {
            return;
        },
        vision: 0
    },
    enemy_guard: { //位置不动 攻击范围内敌人
        name: "Enemy",
        control: function(tadpole, condition) {
            if (condition.enemyNum > 0) {
                var e = condition.closeEnemy;
                tadpole.userUpdate(e.x, e.y, null);
                if (Math.cos(Math.atan2(e.y - tadpole.y, e.x - tadpole.x) - tadpole.angle) > 0.99) tadpole.onFire = true;
                tadpole.timeSinceLastServerUpdate = 0;
            } else {
                tadpole.cease();
            }
            return;
        },
        vision: 250
    },
    enemy_floating: { //随机移动，会追击视野内敌人
        name: "Enemy",
        change: 200,
        status: 1,
        //1 游荡 2追击敌人
        target: null,
        direction: Math.random() * 2 * Math.PI,
        control: function(tadpole, condition) {
            if (tadpole.AI.status == 1) {
                if (condition.enemyNum > 0) {
                    tadpole.AI.target = condition.closeEnemy;
                    tadpole.AI.status = 2;
                } else {
                    if (tadpole.age % tadpole.AI.change == 0) {
                        tadpole.AI.direction += 0.5 * (Math.random() - 0.5) * Math.PI;
                        tadpole.AI.change = Math.floor(randPoint(tadpole.AI.initChange, 0.3));
                    }
                    if (tadpole.speed < tadpole.speedMax) tadpole.motion_add(tadpole.AI.direction, 0.5 * tadpole.standardAcc);
                    tadpole.cease();
                    tadpole.userUpdate(0, 0, tadpole.speedAngle);
                }
            } else {

                var e = tadpole.AI.target;
                tadpole.userUpdate(e.x, e.y, null);
                
                tadpole.AI.direction = Math.atan2(e.y - tadpole.y, e.x - tadpole.x);
                if (tadpole.speed < tadpole.speedMax && getDistance(e.x, e.y, tadpole.x, tadpole.y) > tadpole.AI.vision) tadpole.motion_add(tadpole.AI.direction, 0.5 * tadpole.standardAcc);
                if (Math.cos(Math.atan2(e.y - tadpole.y, e.x - tadpole.x) - tadpole.angle) > 0.99) tadpole.onFire = true;
                tadpole.timeSinceLastServerUpdate = 0;

                if (e.die || getDistance(e.x, e.y, tadpole.x, tadpole.y) > tadpole.AI.outVision) tadpole.AI.status = 1;
            }
            return;
        },
        vision: 150,
        outVision: 1500
        //outVision为放弃追踪的最大距离
    },
}

var AI = function(aiSettings) {
    this.vision = aiSettings.vision || 0;
    this.outVision = aiSettings.outVision || 99999;
    this.direction = aiSettings.direction || null;
    this.initChange = aiSettings.change || null;
    this.change = aiSettings.change || null;
    this.status = aiSettings.status || null;
    this.target = null;
    this.update = aiSettings.control;
}




/*

type

control = function(tadpole,condition) {

}
vision 视野

*/