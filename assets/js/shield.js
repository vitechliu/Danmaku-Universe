var standardShield = {
    standard_I:{
        size:4,
        color:"rgba(100,200,255,",
        capacity:200,
        capacityRegen:0.1,
        revTime:360,
    }
};



var Shield = function(sSettings,tadpole) {
    var shield = this;
    
    this.size = sSettings.size + tadpole.size;
    this.color = sSettings.color;
    this.capacity = sSettings.capacity;
    this.capacityRegen = sSettings.capacityRegen;
    this.revTime = sSettings.revTime;
    this.status = 2;
    // 0为摧毁 1为恢复中 2为正常 3为消失中
    this.jammed = false; //干扰 留给以后
    this.time = 0;
    this.opacity = 0.5;
    this.tadpole = tadpole;
    this.hp = this.capacity;
    
    this.update = function() {
        if (shield.status == 0 && !shield.jammed) {
            shield.time++;
            if (shield.time == shield.revTime) shield.status = 1;
        } else if (shield.status == 1) {
            shield.opacity += 0.02;
            if (shield.opacity >= 0.5) shield.status = 2;
        } else if (shield.status == 3) {
            shield.opacity -= 0.02;
            if (shield.opacity <= 0) shield.status = 0;
        }
            
        shield.hp += (shield.hp<shield.capacity) ? shield.capacityRegen : 0;
    }
    
    this.draw = function(context) {
        context.save();
        context.fillStyle = shield.color + shield.opacity + ')';
        context.beginPath();
        context.arc(shield.tadpole.x, shield.tadpole.y, shield.size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.restore();
    }
    
    this.onHit = function(dmg) {
        shield.hp -= dmg;
        if (shield.hp<0) {
            shield.hp = shield.capacity;
            shield.time = 0;
            shield.status = 3;
        }
    }
}