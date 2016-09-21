var NoticeHandler = function(model) {
    var nh = this;
    var model = model;
    var box = $("#noticeBox");
    var txt = $("#noticeText");
    
    this.time = 0;
    this.notice = [];
    
    this.onShow = false; //UI中noticeBox是否处于待机状态

    
    this.pushNotice = function(str,time=300) {
        nh.notice.push({
            s:str,
            t:time
        });
        if (nh.notice.length == 1) show();
    }
    this.update = function() {
        if (nh.notice.length>0) {
            if (nh.time == nh.notice[0].t) {
                nh.time = 0;
                nh.notice.shift();
                if (nh.notice.length>0) {
                    show();
                } else {
                    box.animate({top:'-100px'},500);
                    nh.onShow = false;
                }
            } else nh.time++;
        }
        
    }
    
    function show() {
        if(!nh.onShow) {
            txt.html(nh.notice[0].s);
            box.animate({top:'5px'},500);
            nh.onShow = true;
        } else {
            txt.animate({opacity:'0'},500,'swing',function(){
                txt.html(nh.notice[0].s);
                txt.animate({opacity:'1'},500);
            });
        }
    }
}