var MessageHandler = function(model) {
    var messageHandler = this;
    var model = model;
    
    var msgType = [];
    
    var msgLog = [];
    
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
        
        //调试
        messageHandler.popMessage(msg,"user");
    }
    
    var handleSetName = function(name) {
        model.userTadpole.name = name;
        $('#nick').val(model.userTadpole.name);
        $.cookie('todpole_name', model.userTadpole.name, {expires:14});
        messageHandler.popMessage("成功将名称改为"+name+",输入/register 用户名 密码 来注册成为正式用户.","server");
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
    this.popMessage = function(msg,type) {
        function delHtmlTag(str){
            str=str.replace(/</g,'&lt;');    //置换符号<
            str=str.replace(/>/g,'&gt;');
            return str;//去掉所有的html标记
        }
        
        if(type != "server" && type != "admin" ) msg = delHtmlTag(msg);
        
        type = type || "default";
        
        var printInfo = "";
        var printEnd = "";
        switch(type) {
            case "init": {
                printInfo += "<span class=\"info-init\">";
                printEnd += "</span>";
            } break;
            case "server": {
                printInfo += "<span class=\"info-server\">[Server]</span>";
            } break;
            case "user": {
                var name;
                if (model.userTadpole.name != '') name = model.userTadpole.name;
                else name = "游客";
                printInfo += "<span class=\"info-user\">["+name+"]";
                printEnd += "</span>";
            } break;  
            default: {}
        }
        printInfo += msg + printEnd +"<br>";
        $(".mCSB_container").append(printInfo);
        $("#infoBox").mCustomScrollbar("update");
        $("#infoBox").mCustomScrollbar("scrollTo","bottom",{scrollInertia:300});
        msgLog.push(printInfo);``
          
    }
    
}