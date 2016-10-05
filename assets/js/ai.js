
var AI = function(aiSettings) {
    this.name = aiSettings.name || null;
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
