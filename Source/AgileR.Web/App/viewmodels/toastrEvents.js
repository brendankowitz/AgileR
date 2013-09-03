define(["../../Scripts/toastr"], function(toastr) {

    var channel = postal.channel();

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