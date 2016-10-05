var standardWeapon = {
    standard_laser_I:{
        name:"Standard Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:10,
        danmakuType:standardDanmaku.rec_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        price:1000,
        tier:1,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    tripple_laser_I:{
        name:"Tripple Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:22,
        danmakuType:standardDanmaku.rec_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:3,
        price:1500,
        tier:1,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a+Math.PI*(n-1)/40
            };
        }
    },
    laser_I:{
        name:"Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:240,
        danmakuType:standardDanmaku.rec_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        price:5,
        tier:0,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    spiral_laser_I:{
        name:"Spiral Laser I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:2,
        danmakuType:standardDanmaku.rec_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        price:3800,
        tier:2,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n,t) {
            var angleDiff = Math.cos(t/7)*Math.PI/10;
            return {
              x:x,y:y,a:a+angleDiff
            };
        }
    },
    spiral_laser_II:{
        name:"Spiral Laser II",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:2,
        danmakuType:standardDanmaku.rec_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:2,
        price:7000,
        tier:2,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n,t) {
            var angleDiff = Math.cos(t/7)*Math.PI/10;
            angleDiff *= 2*(n % 2)-1;
            return {
              x:x,y:y,a:a+angleDiff
            };
        }
    },
    sniper_laser_I:{
        name:"Sniper Laser II",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:120,
        danmakuType:standardDanmaku.rec_bullet_II,
        counterShield:false,
        speedAdd:2,
        damageAdd:4,
        num:1,
        price:2400,
        tier:1,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n,t) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    guard_mine_I:{
        name:"Guard Mine 1",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:10,
        danmakuType:standardDanmaku.slowMine_circle_bullet_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        price:5000,
        tier:2,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n,t) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    //激光类-----------------------------------------------
    beam_I:{
        name:"Beam I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:1,
        danmakuType:standardDanmaku.rec_beam_I,
        counterShield:false,
        speedAdd:1,
        damageAdd:1.2, //不可穿透型攻击较高
        num:1,
        tier:2,
        price:4500,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    short_beam_I:{
        name:"Short Beam I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:1,
        danmakuType:standardDanmaku.rec_beam_II,
        counterShield:false,
        speedAdd:1,
        tier:1,
        damageAdd:1.2, //不可穿透型攻击较高
        num:1,
        price:2550,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    penetrable_beam_I:{
        name:"Penetrable Beam I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:1,
        danmakuType:standardDanmaku.rec_beam_III,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:1,
        tier:2,
        price:7000,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    guard_beam_I:{
        name:"Guard Beam I",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:1,
        danmakuType:standardDanmaku.rec_beam_IV,
        counterShield:false,
        speedAdd:1,
        damageAdd:1,
        num:4,
        tier:2,
        price:6500,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x;
            var wy = tadpole.y;
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a+n*Math.PI/2+Math.PI/4
            };
        }
    },
    
    //特殊武器
    broken_plasma_storm:{
        name:"Broken Plasma Storm",
        hasSprites:false,
        isDesigned:false,
        isRandomed:false,
        frequency:20,
        danmakuType:standardDanmaku.circle_bullet_II,
        counterShield:false,
        speedAdd:1,
        damageAdd:3,
        num:1,
        price:4600,
        tier:2,
        tadpoleFuncWeapon:function(tadpole) {
            var wx = tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle);
            var wy = tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle);
            var wa = tadpole.angle;
            return {
              x:wx,y:wy,a:wa  
            };
        },
        xyaFuncDanmaku:function(x,y,a,n) {
            return {
              x:x,y:y,a:a
            };
        }
    },
    
};