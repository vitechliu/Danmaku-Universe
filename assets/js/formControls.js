// Settings controls

(function($){
	//初始化Chat系统
	$.fn.initChat = function() {
		var input = $(this); //input#chat本身
        var chatBtn = $("#chatBtn");
        var closeBtn = $("#closeBtn");
		var inputting = false;
        $("#chatBox").css("opacity",0);
        var that = this;
        
        
        input.focus(function(e) {
            inputting = true;
        });
        
        input.blur(function(e) {
            inputting = false;
        });
        //历史消息
		var messageHistory = [];
		var messagePointer = -1;
        
        //关闭聊天框
		var closechat = function() {
            window.initEnter = 0;
			inputting = false;
            $("#chatBox").animate({opacity:"0"});
			input.blur();
			messagePointer = messageHistory.length;
			input.val('');
		}
        chatBtn.click(function(e){
            if(input.val().length > 0) {
                messageHistory.push(input.val());
                messagePointer = messageHistory.length;
                app.sendMessage(input.val());
                $("#infoBox").mCustomScrollbar("scrollTo","bottom");
                input.val("");
                input.focus();
            }
        });
        closeBtn.click(function(e){
            closechat();
        });
        
		input.keydown(function(e){
            
			if(inputting) {
		
				e.stopPropagation(); //防止app.keyDown再次监听
                
                //方向键来输入上一条或下一条消息 !!
				if(messageHistory.length > 0) {
					if(e.keyCode == keys.direction_up)
					{
						if(messagePointer > 0)
						{
							messagePointer--;
							input.val(messageHistory[messagePointer]);
						}
					}
					else if(e.keyCode == keys.direction_down)
					{
						if(messagePointer < messageHistory.length-1)
						{
							messagePointer++;
							input.val(messageHistory[messagePointer]);
						}
						else 
						{
							closechat();
							return;
						}
					}
				}
			}
		});
		input.keyup(function(e) {

			var k = e.keyCode;
			if(input.val().length >= 120)
			{
				input.val(input.val().substr(0,120));
			}

			if(inputting) {
                if(k == keys.enter) {
                    if(window.initEnter == 1) {
                        window.initEnter = 0;
                        return;
                    }
                    if(input.val().length > 0) {
                        messageHistory.push(input.val());
			    	    messagePointer = messageHistory.length;
                        app.sendMessage(input.val());
                        $("#infoBox").mCustomScrollbar("scrollTo","bottom");
                        input.val("");
                        input.focus();
                    } else closechat();
                } else if (k == keys.esc) {
                    closechat();
                }
				e.stopPropagation();
			}
			
		});
	}
	
	$(function() {
		
	});
})(jQuery);
