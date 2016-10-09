var Item = function(iSettings,detail) {
    var item = this;
    this.type = iSettings.type;
    
    this.x = detail.x || 0;
    this.y = detail.y || 0;
    this.speed = iSettings.speed || 2;
    this.friction = 0.05;
    this.speedAngle = iSettings.speedAngle || Math.random()*2*Math.PI;
    this.shape = iSettings.shape || "circle";
    this.color = iSettings.color || "rgba(255,255,255,";
    this.life = 0;
    this.opacity = 1;
    this.maxLife = iSettings.maxLife || 1000;
    this.fadeLife = this.maxLife > 100 ? this.maxLife - 100 : -1; 
    this.icon = iSettings.icon || null;
    if (this.icon!= null) {
        this.image = new image();
        this.image.src = "game/item/icon"+this.icon;
    }
    this.die = false;
    
    switch(this.shape) {
        case "circle":{
            this.radius = iSettings.radius || 10;
        } break;
        default: {} break;
    }
    
    
    
    this.update = function(model) {
        item.life++;
        if (item.life == item.maxLife) item.die = true;
        item.opacity = Math.max(Math.min(1,item.life - item.fadeLife),0);
        item.x += item.speed*Math.cos(item.speedAngle);
        item.y += item.speed*Math.sin(item.speedAngle);
        item.speed = (item.speed < item.friction) ? 0 : item.speed - item.friction;
    }
    
    this.draw = function(context) {
        context.save();
        context.fillStyle = item.color + item.opacity*0.1 + ")";
        context.strokeStyle = item.color + item.opacity + ")";
        switch(this.shape) {
            case "circle":{
                context.beginPath();
                context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
                
                context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
                context.stroke();
                
                context.drawImage(item.image,item.x-item.radius,item.y-item.radius,item.radius*2,item.radius*2);
            } break;
            default: {} break;
        }
        context.restore();
    }
}