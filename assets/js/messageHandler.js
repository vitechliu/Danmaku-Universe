var MessageHandler = function(model) {
    var messageHandler = this;
    var model = model;
    
    var msgType = [];
    
    
    
    //处理消息
    this.handleMessage = function(msg) {
        var tadpole = model.tadpoles[-1];
        var tested = false;
        console.log(1);
        $.each(msgType,function(idx,obj) {
            var regexp = obj.pattern;
            if(regexp.test(msg)) {
                console.log(3)
                switch(obj.arg) {
                    case 2:obj.func(msg.match(regexp)[1],msg.match(regexp)[2]); break;
                    case 1:obj.func(msg.match(regexp)[1]); break;
                    default:obj.func();
                }
                tested = true;
                return;
		    }
        });
        
        if (tested) return;
        
        tadpole.timeSinceLastServerUpdate = 0;
        tadpole.messages.push(new Message(msg));
    }
    
    var handleSetName = function(name) {
        model.userTadpole.name = name;
        $('#nick').val(model.userTadpole.name);
        $.cookie('todpole_name', model.userTadpole.name, {expires:14});
        return;
    };
    
    var handleRegister = function(username,password) {
        model.userTadpole.name = name;
        $('#nick').val(model.userTadpole.name);
        $.cookie('todpole_name', model.userTadpole.name, {expires:14});
        return;
    };
    
    var handleKeyArrow = function() {
        keys.up = keys.direction_up;
        keys.down = keys.direction_down;
        keys.left = keys.direction_left;
        keys.right = keys.direction_right;
        return;
    };
    
    var handleKeyWASD = function() {
        keys.up = keys.w;
        keys.down = keys.s;
        keys.left = keys.a;
        keys.right = keys.d;
        return;
    };
    
    msgType.push({
        pattern:/^\/setname (\S+)$/i,
        arg:1,
        func:handleSetName
    });
    msgType.push({
        pattern:/^\/register (\S+) (\S+)$/i,
        arg:2,
        func:handleRegister
    });
    msgType.push({
        pattern:/^\/keyarrow$/i,
        arg:0,
        func:handleKeyArrow
    });
    msgType.push({
        pattern:/^\/keywasd$/i,
        arg:0,
        func:handleKeyWASD
    });
    //显示消息
    this.popMessage = function(msg,color) {
        
    }
}