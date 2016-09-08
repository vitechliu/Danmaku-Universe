var standardAI = {
    enemy_tadpole_idle:{
        name:"Enemy",
        control:function(tadpole,condition) {
            return;
        },
        vision:800
    }
}

var AI = function(aiSettings) {
    
    
    this.update = aiSettings.control;
}




/*

type

control = function(tadpole,condition) {

}
vision 视野

*/