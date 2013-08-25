define(["/signalr/hubs"], function () {

    var channel = postal.channel();
    var privateChannel = postal.channel("private");

    var taskHub = $.connection.taskBoardHub;
    
    taskHub.client.columnPropertyModified = function (columnId, propertyName, val) {
        console.log("Received " + propertyName + " was set to " + val);
        channel.publish("modify.column.property." + propertyName, { newValue: val, id: columnId });
    };
    
    privateChannel.subscribe("modify.column.property.*", function (d, envelope) {
        var properties = envelope.topic.split('.');
        taskHub.server.columnPropertyModified(d.id, properties[properties.length - 1], d.newValue);
    });

    $.connection.hub.start();

});