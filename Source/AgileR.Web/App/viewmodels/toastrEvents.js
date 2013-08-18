define(["../../Scripts/toastr"], function(toastr) {

    var channel = postal.channel();

    var d = new Date();
    var time = d.getHours();
    if (time < 10) {
        toastr.info("Good morning");
    }
    else if (time > 10 && time < 16) {
        toastr.info("Good afternoon");
    }
    else {
        toastr.info("Good evening");
    }

    channel.subscribe("notification", function(obj) {
        toastr.info(obj.message);
    });
    
    channel.subscribe("notification.error", function (obj) {
        toastr.error(obj.message);
    });
    
    channel.subscribe("notification.success", function (obj) {
        toastr.success(obj.message);
    });


});