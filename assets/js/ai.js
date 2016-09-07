var standardAI = {
    enemy_tadpole:{
        name:"Enemy",
        control:function(tadpole,condition) {
            
        }
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