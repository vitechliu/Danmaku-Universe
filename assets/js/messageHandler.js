var MessageHandler = function(model) {
    var messageHandler = this;
    var model = model;
    
    this.handleMessage = function(msg) {
        var regexp = /\/setName ?(.+)/i;
        var tadpole = model.tadpoles[-1];
		if(regexp.test(msg)) {
			model.userTadpole.name = msg.match(regexp)[1];
			$('#nick').val(model.userTadpole.name);
			$.cookie('todpole_name', model.userTadpole.name, {expires:14});
			return;
		}
        
        tadpole.timeSinceLastServerUpdate = 0;
        tadpole.messages.push(new Message(msg));
    }
}