// Settings controls

(function($){
	//初始化Chat系统
	$.fn.initChat = function() {
		var input = $(this); //input#chat本身
		var inputting = false;
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
			inputting = false;
			input.blur();
			messagePointer = messageHistory.length;
			input.val('');
		}

		input.keydown(function(e){
            
			if(inputting) {
		
				e.stopPropagation(); //防止app.keyDown再次监听
                
                //方向键来输入上一条或下一条消息 !!
				if(messageHistory.length > 0) {
					if(e.keyCode == keys.up)
					{
						if(messagePointer > 0)
						{
							messagePointer--;
							input.val(messageHistory[messagePointer]);
						}
					}
					else if(e.keyCode == keys.down)
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
			if(input.val().length >= 45)
			{
				input.val(input.val().substr(0,45));
			}

			if(inputting) {
                if(k == keys.enter) {
                    if(input.val().length > 0) {
                        messageHistory.push(input.val());
			    	    messagePointer = messageHistory.length;
                        app.sendMessage(input.val());
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
		//$('#chat').initChat();
	});
})(jQuery);
