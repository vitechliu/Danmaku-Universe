var standardDanmaku = {
    rec_bullet_I:{
        type:"bullet",
        shape:"rec",
        height:1,
        width:3,
        speedFunc:function(time) {
            return 8;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000,
        penetrable:false,
        damage:50
    },
    rec_bullet_II:{ //较长的rec1
        type:"bullet",
        shape:"rec",
        height:1.2,
        width:6,
        speedFunc:function(time) {
            return 8;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000,
        penetrable:false,
        damage:100
    },
    circle_bullet_I:{
        type:"bullet",
        shape:"circle",
        size:1,
        speedFunc:function(time) {
            return 8;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000,
        penetrable:false,
        damage:50
    },
    circle_bullet_II:{ //大型圆子弹 
        type:"bullet",
        shape:"circle",
        size:3,
        speedFunc:function(time) {
            return 8;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1000,
        penetrable:false,
        damage:50,
        blur:2
    },
    slowMine_circle_bullet_I:{ //防御型弹幕 会漂浮不动
        type:"bullet",
        shape:"circle",
        size:1,
        speedFunc:function(time) {
            return 8/time;
        },
        angleFunc:function(defaultAngle,time) {
            return defaultAngle;
        },
        color:"rgba(255,255,255,",
        opacity:0.9,
        maxLife:1500,
        penetrable:false,
        damage:50
    },
    
    rec_beam_I:{ //激光
        type:"beam",
        shape:"line",
        width:1,
        distance:500,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:false, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    
    rec_beam_II:{ //短激光
        type:"beam",
        shape:"line",
        width:1,
        distance:50,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:false, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    rec_beam_III:{ //激光 可穿透
        type:"beam",
        shape:"line",
        width:1,
        distance:500,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:true, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    },
    
    rec_beam_IV:{ //短激光 可穿透
        type:"beam",
        shape:"line",
        width:1,
        distance:50,
        damage:1,
        damageFurtherLower:false, //是否衰减
        penetrable:true, //穿透
        maxLife:15,
        color:"rgba(255,255,255,",
        opacity:.7,
        blur:3,
        effect:standardEffect.particles.super_small
    }
}