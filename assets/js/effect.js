//大致完善！！

/*
particles:粒子效果

ring:环状效果

show 展现文字
*/
var standardEffect = {
    particles:{
        small:{
            type:"particles",
            particleNum:12,
            fadeStartTime:15,
            fadeEndTime:90,
            startSpeed:0.7,
            endSpeed:1.5
        },
        medium: {
            type:"particles",
            particleNum:15,
            fadeStartTime:25,
            fadeEndTime:150,
            startSpeed:0.9,
            endSpeed:2.5,
            friction:0.08
        },
        large: {
            type:"particles",
            particleNum:35,
            fadeStartTime:25,
            fadeEndTime:170,
            startSpeed:1.5,
            endSpeed:4,
            friction:0.1,
            minSpeed:0.15,
            startSize:0.2,
            endSize:2,
            blur:6
        },
        super_small:{
            type:"particles",
            particleNum:1,
            fadeStartTime:15,
            fadeEndTime:90,
            startSpeed:0.6,
            endSpeed:1.2
        },
    },
    ring:{
        small_out:{
            type:"ring",
            lineWidth:3,
            startRadius:0,
            endRadius:10,
            time:60,
            color:"rgba(255,255,255,",
            blur:4,
            fade:true,
            fadeLine:true,
        },
        medium_out:{
            type:"ring",
            lineWidth:4,
            startRadius:0,
            endRadius:20,
            time:80,
            color:"rgba(255,255,255,",
            blur:5,
            fade:true,
            fadeLine:true,
        },
        large_out:{
            type:"ring",
            lineWidth:6,
            startRadius:0,
            endRadius:40,
            time:90,
            color:"rgba(255,255,255,",
            blur:6,
            fade:true,
            fadeLine:true,
        },
        small_in:{
            type:"ring",
            lineWidth:3,
            startRadius:10,
            endRadius:0,
            time:60,
            color:"rgba(255,255,255,",
            blur:4,
            fade:true,
            fadeLine:true,
        },
        medium_in:{
            type:"ring",
            lineWidth:4,
            startRadius:20,
            endRadius:0,
            time:80,
            color:"rgba(255,255,255,",
            blur:5,
            fade:true,
            fadeLine:true,
        },
        large_in:{
            type:"ring",
            lineWidth:6,
            startRadius:40,
            endRadius:0,
            time:90,
            color:"rgba(255,255,255,",
            blur:6,
            fade:true,
            fadeLine:true,
        }
    },
    show:{
        txt_levelup:{
            type:"show"
        }
    }
}
var randRange = function(eStart,eEnd) { //随机从start到End
        return Math.random()*(eEnd-eStart)+eStart;
    }
    
    
var randPoint = function(eTarget,eRange) { //eTarget±eTarget*eRange
        return Math.random()*(2*eTarget*eRange)+eTarget-eRange*eTarget;
}

var Effect  = function (eSettings,x,y,startAngle=0,endAngle=Math.PI*2) {
    var effect = this;
    var type = eSettings.type;
    this.type = eSettings.type;
    this.die = false;
    
    var setParticleOpacity = function(tStart,life,tEnd) { //三角函数
        return 0.5*(Math.cos(Math.PI*(life-tStart)/(tEnd-tStart))+1);
    }
    
    switch(type) {
        case "particles": {
            this.particles = [];
            var num = eSettings.particleNum;
            var startAngle = startAngle || 0;
            var endAngle = endAngle || Math.PI*2;
            var startSpeed = eSettings.startSpeed || 0.7;
            var endSpeed = eSettings.endSpeed || 2;
            var friction = eSettings.friction || 0.05;
            var fadeStartTime = eSettings.fadeStartTime || 20;
            var fadeEndTime = eSettings.fadeEndTime || 150;
            var startSize = eSettings.startSize || 0.1;
            var endSize = eSettings.endSize || 0.7;
            var minSpeed = eSettings.minSpeed || 0.1;
            
            this.blur = eSettings.blur || 0;
            this.color = eSettings.color || "rgba(255,255,255,";
            
            var x = x || 0;
            var y = y || 0;
            //var 
            //Init
            
            for (var i = 0; i < num; i++) {
                this.particles.push({
                    pAngle:randRange(startAngle,endAngle),
                    pSpeed:randRange(startSpeed,endSpeed),
                    pMinSpeed:randPoint(minSpeed,0.2),
                    pFriction:friction,
                    pFadeStartTime:randPoint(fadeStartTime,0.2),
                    pFadeEndTime:randPoint(fadeEndTime,0.2),
                    pSize:randRange(startSize,endSize),
                    pLife:0,
                    pOpacity:1,
                    pX:x,
                    pY:y,
                    pDie:false
                });
            }
            
        } break;
        case "ring": {
            this.radius = eSettings.startRadius || 0;
            this.startRadius = eSettings.startRadius || 0;
            this.endRadius = eSettings.endRadius || 10;
            this.time = eSettings.time || 60;
            this.lineWidth = eSettings.lineWidth || 3;
            this.line= eSettings.lineWidth || 3;
            
            this.fade = eSettings.fade || true;
            this.fadeLine = eSettings.fadeLine || true;
            this.blur = eSettings.blur || 0;
            this.color = eSettings.color || "rgba(255,255,255,";
            this.opacity = 1;
            
            this.x = x || 0;
            this.y = y || 0;
            this.life = 0;
            //var 
            //Init
            
        } break;
        default: {} break;
    }
    
    this.update = function () {
        switch(effect.type) {
            case "particles": {
                for (var i = effect.particles.length - 1; i>=0;i--) {
                    var p = effect.particles[i];
                    p.pLife++;
                    p.pX+=p.pSpeed*Math.cos(p.pAngle);
                    p.pY+=p.pSpeed*Math.sin(p.pAngle);
                    p.pSpeed = (p.pSpeed - p.pFriction < p.pMinSpeed) ? p.pMinSpeed : p.pSpeed - p.pFriction;
                    if (p.pLife>p.pFadeEndTime) effect.particles.splice(i,1);
                    else if (p.pLife>p.pFadeStartTime) {
                        p.pOpacity = setParticleOpacity(p.pFadeStartTime,p.pLife,p.pFadeEndTime);
                    }
                }
                
                if (effect.particles.length == 0) effect.die = true;
            } break;
            case "ring": {
                effect.life++;
                effect.radius = 0.5*(effect.startRadius-effect.endRadius)*(Math.cos(effect.life*Math.PI/effect.time)-1)+effect.startRadius;
                if (effect.fade) effect.opacity = 0.5*Math.cos(effect.life*Math.PI/effect.time)+0.5; //如果褪色则降低透明度
                if (effect.fadeLine) effect.line = effect.lineWidth*(0.5*Math.cos(effect.life*Math.PI/effect.time)+0.5); //如果褪色则降低透明度
                if (effect.life == effect.time) effect.die = true;
            } break;
            default: {} break;
        }
    }
    
    this.draw = function(context) {
        switch(effect.type) {
            case "particles": {
                context.save();
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur    = effect.blur;
                for (var i = effect.particles.length - 1; i>=0;i--) {
                    var p = effect.particles[i];
                    context.shadowColor = effect.color+p.pOpacity*0.7+')';
                    context.fillStyle = effect.color+p.pOpacity+')';
                    context.beginPath();
                    context.arc(p.pX, p.pY,p.pSize, 0, Math.PI*2, true);
                    context.closePath();
                    context.fill();
                }
                context.restore();
            } break;
            case "ring": {
                context.save();
                
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur    = effect.blur;
                context.shadowColor = effect.color+effect.opacity*0.7+')';
                context.strokeStyle = effect.color+effect.opacity+')';
                context.beginPath();
                context.arc(effect.x,effect.y,effect.radius,0,Math.PI*2,true);
                context.lineWidth = effect.line;
                context.stroke();
                
                context.restore();
            } break;
            default: {} break;
        }
    }
}