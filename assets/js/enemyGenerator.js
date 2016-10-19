var EnemyGenerator = function() {
    
    var eg = this;
    
    var stdGetRand = function(obj) {
        var r = Math.floor(Math.random()*Object.keys(obj).length); //0-length-1
        var i = 0;
        for (var k in obj) { 
            if (i==r) return obj[k];
            else i++;
        }
    }
    var rand = function(r) {
        return (Math.random()<r);
    }
    this.update = function(model,time) {
        var maxEnemy = Math.max(Math.min(5,time/3600),1);
        if (model.getEnemyNum(model.userTadpole,1000)<maxEnemy && rand(0.01)) {
            var angle = Math.random()*Math.PI*2,
                x = 700 * Math.cos(angle)+model.userTadpole.x,
                y = 700 * Math.sin(angle)+model.userTadpole.y;
            var st = {};
            st.x = x;
            st.y = y;
            st.AI = new AI(standardAI.enemy_floating);
            st.camp = camp[4];
            st.isLeader =rand(0.1) ? true : false;
            st.level = Math.floor(Math.random()*time/3600)+1;
            //st.shield = 
            st.speedMax = Math.pow(st.level,0.1);
            st.standardAcc = Math.pow(0.25*st.level,0.1);
            st.friction =0.05;
            var wp = stdGetRand(standardWeapon);
            console.log(wp);
            model.addEnemy(st,wp);
        }
    }
}