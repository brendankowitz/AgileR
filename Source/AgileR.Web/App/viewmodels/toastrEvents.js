define(["../../Scripts/toastr"], function(toastr) {

    var channel = postal.channel();

    toastr.info("Events loaded!");

    channel.subscribe("notification", function(obj) {
        toastr.info(obj.message);
    });

});