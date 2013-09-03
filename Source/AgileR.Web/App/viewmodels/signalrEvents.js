define(["/signalr/hubs"], function() {

    var channel = postal.channel();
    var privateChannel = postal.channel("private");

    var taskHub = $.connection.taskBoardHub;

    taskHub.client.columnPropertyModified = function (columnId, propertyName, val) {
        console.log("Received " + propertyName + " was set to " + val);
        channel.publish("modify.column.property." + propertyName, { newValue: val, id: columnId, _incoming: true });
    };

    privateChannel.subscribe("modify.column.property.*", function (d, envelope) {
        if (!d._incoming) {
            var properties = envelope.topic.split('.');
            taskHub.server.columnPropertyModified(d.id, properties[properties.length - 1], d.newValue);
        }
    });

    taskHub.client.taskPropertyModified = function (taskId, propertyName, val) {
        console.log("Received " + propertyName + " was set to " + val);
        channel.publish("modify.task.property." + propertyName, { newValue: val, id: taskId, _incoming: true });
    };

    privateChannel.subscribe("modify.task.property.*", function (d, envelope) {
        if (!d._incoming) {
            var properties = envelope.topic.split('.');
            taskHub.server.taskPropertyModified(d.id, properties[properties.length - 1], d.newValue);
        }
    });

    channel.subscribe("move.task.request", function (d) {
        if (!d._incoming) {
            taskHub.server.taskMoved(d.taskId, d.toColumnId);
        }
    });

    taskHub.client.taskMoved = function (taskId, toColumnId) {
        channel.publish("move.task.request", { taskId: taskId, toColumnId: toColumnId, _incoming: true });
    };

    channel.subscribe("delete.task.request", function (d) {
        if (!d._incoming) {
            taskHub.server.taskRemoved(d.taskId);
        }
    });

    taskHub.client.taskRemoved = function (taskId) {
        channel.publish("delete.task.request", { taskId: taskId, _incoming: true });
    };

    $.connection.hub.start();
    
});