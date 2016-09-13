var MessageHandler = function(model) {
    var messageHandler = this;
    var model = model;
    
    
    
    var msgLog = [];
    
    //处理消息
    this.handleMessage = function(msg) {
        var tadpole = model.userTadpole;
        var tested = false;
        $.each(msgType,function(idx,obj) {
            var regexp = obj.pattern;
            if(regexp.test(msg)) {
                switch(obj.arg) {
                    case 4:obj.func(msg.match(regexp)[1],msg.match(regexp)[2],msg.match(regexp)[3],msg.match(regexp)[4]); break;    
                    case 3:obj.func(msg.match(regexp)[1],msg.match(regexp)[2],msg.match(regexp)[3]); break;
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
        
        return;
    };
    
    var handleHelp = function() {
        messageHandler.popMessage("指令列表 1-1  方括弧'[]'中为参数，输入时请勿输入方括弧!","info");
        messageHandler.popMessage("/setname [名称] : 修改名称","info");
        messageHandler.popMessage("/register [用户名] [密码]: 注册,请勿使用中文字符作为用户名或密码","info");
        messageHandler.popMessage("/keywasd : 修改基础操作方式为WASD操作","info");
        messageHandler.popMessage("/keyarrow : 修改基础操作方式为方向键操作","info");
        messageHandler.popMessage("/addEnemy [AI] [数量]: 生成特定AI的敌机","info");
    }
    
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
    
    var handleSetWeapon = function(place,wp) {
        var success = true;
        if(model.userTadpole.weaponSlot < place) {
            messageHandler.popMessage("此武器槽尚未开放!","server");
            return;
        }
        try {
            model.userTadpole.equip(new Weapon(standardWeapon[wp],model.userTadpole),place,model);
        } catch(e){
            console.log(e);
            messageHandler.popMessage("请输入正确的武器名!","server");
            success = false;
        }
        if(success) {
            messageHandler.popMessage("成功装备该武器.","server");
        }
    }
    
    var handleAddEnemy = function(AIinput,num) {
        var success = true;
        try {
            var AIadd = standardAI[AIinput];
            for (var i=0;i<num;i++) {
                var rs = {};
                rs.x = Math.random()*300+model.userTadpole.x-150;
                rs.y = Math.random()*300+model.userTadpole.y-150;
                rs.camp = camp[2];
                rs.speedMax = 1;
                rs.standardAcc = 0.25;
                rs.friction =0.05
                rs.AI = new AI(AIadd);
                model.addEnemy(rs,standardWeapon.standard_laser_I,"testObject");
            }
        } catch(e) {
            console.log(e);
            messageHandler.popMessage("请输入正确的AI!","server");
            success = false;
        } 
        if(success) {
            messageHandler.popMessage("生成了敌机.","server");
        }
    }
    //指令对应表
    var msgType = [{
        pattern:/^\/setname (\S+)$/i,
        arg:1,
        func:handleSetName
    },{
        pattern:/^\/register (\S+) (\S+)$/i,
        arg:2,
        func:handleRegister
    },{
        pattern:/^\/help$/i,
        arg:0,
        func:handleHelp
    },{
        pattern:/^\/keyarrow$/i,
        arg:0,
        func:handleKeyArrow
    },{
        pattern:/^\/keywasd$/i,
        arg:0,
        func:handleKeyWASD
    },{
        pattern:/^\/setweapon ([1-4]) (\S+)$/i,
        arg:2,
        func:handleSetWeapon
    },{
        pattern:/^\/addEnemy (\S+) ([1-9]\d*)$/i,
        arg:2,
        func:handleAddEnemy
    }];
    
    
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
            case "info": {
                printInfo += "<span class=\"info-info\">[Info]";
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