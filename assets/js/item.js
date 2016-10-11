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
    this.size = iSettings.size || 10;
    if (this.icon!= null) {
        this.image = new image();
        this.image.src = "game/item/icon"+this.icon;
    }
    this.die = false;
    this.insight = false;
    this.cursorStatus = 0;
    switch(this.shape) {
        case "circle":{
            this.radius = iSettings.radius || 10;
        } break;
        default: {} break;
    }
    
    var setCursorDis = function(tStart,life,tEnd) { 
        return 0.5*(Math.cos(Math.PI*(life-tStart)/(tEnd-tStart))+1)+1.5;
    }
    
    this.update = function() {
        item.life++;
        if (item.life == item.maxLife) item.die = true;
        item.opacity = Math.max(Math.min(1,item.life - item.fadeLife),0);
        item.x += item.speed*Math.cos(item.speedAngle);
        item.y += item.speed*Math.sin(item.speedAngle);
        item.speed = (item.speed < item.friction) ? 0 : item.speed - item.friction;
        
        if (item.insight) item.cursorStatus+= item.cursorStatus < 100 ? 1 : 0;
        else item.cursorStatus-= item.cursorStatus > 0 ? 1 : 0;
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
        if (item.cursorStatus>0) {
            context.strokeStyle = "rgba(255,255,255," + (item.cursorStatus/100).toFixed(2) + ")";
            var dis = setCursorDis(0,item.cursorStatus/100,1)*item.size;
            var length = 0.5*item.size;
            
            context.moveTo(item.x-dis+length,item.y-dis);
            context.lineTo(item.x-dis,item.y-dis);
            context.lineTo(item.x-dis,item.y-dis+length);
            context.stroke();
            
            context.moveTo(item.x+dis-length,item.y-dis);
            context.lineTo(item.x+dis,item.y-dis);
            context.lineTo(item.x+dis,item.y-dis+length);
            context.stroke();
            
            context.moveTo(item.x-dis+length,item.y+dis);
            context.lineTo(item.x-dis,item.y+dis);
            context.lineTo(item.x-dis,item.y+dis-length);
            context.stroke();
            
            context.moveTo(item.x+dis-length,item.y+dis);
            context.lineTo(item.x+dis,item.y+dis);
            context.lineTo(item.x+dis,item.y+dis-length);
            context.stroke();
        }
        context.restore();
    }
}
