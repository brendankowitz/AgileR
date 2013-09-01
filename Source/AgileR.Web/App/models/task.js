define(["models/guid"], function(guid) {

    var task = function (from) {
        var context = this;
        this.channel = postal.channel();
        this.privateChannel = postal.channel("private");
        this.id = ko.observable(from.Id || from.id || guid()),
        this.title = ko.observable(from.Title || from.title);
        this.description = ko.observable(from.Description || from.description);
        this.index = ko.observable(from.Index || from.index);
        
        var isUpdating = false;
        var setProperty = function (name, value) {
            isUpdating = true;
            context[name](value);
            isUpdating = false;
        };

        this.channel.subscribe("modify.task.property.*", function (data, envelope) {
            if (data.id == context.id()) {
                var properties = envelope.topic.split('.');
                setProperty(properties[properties.length - 1], data.newValue);
            }
        });

        this.title.subscribe(function (newValue) {
            if (isUpdating) return;
            context.privateChannel.publish("modify.task.property.title", { id: context.id(), newValue: newValue });
        });
    };
    
    task.prototype.asJSON = function () {
        return ko.toJSON(this);
    };

    return function (initial) { return new task(initial || {}); };
    
});