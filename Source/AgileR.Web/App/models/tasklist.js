define(["models/task", "models/guid"], function (taskModel, guid) {

    var thisInstance = guid();

    var tasklist = function (obj) {
        var context = this;
        this.channel = postal.channel();
        this.privateChannel = postal.channel("private");
        this.id = ko.observable(obj.Id || obj.id || guid()),
        this.title = ko.observable(obj.Title || obj.title || "untitled");
        this.tasks = ko.observableArray([]);
        this.index = ko.observable(obj.Index || obj.index || 0);

        $.each(obj.Tasks || obj.tasks || [], function (i, type) {
            var model = new taskModel(type);
            context.tasks.push(model);
        });

        this.channel.subscribe("move.task.request", function (data) {
            if (data.toColumnId == context.id()) return;
            var removed = context.tasks.remove(function (item) {
                return data.taskId == item.id();
            });
            if (removed.length > 0) {
                context.channel.publish("add.task.request", { columnId: data.toColumnId, entity: removed[0], removedFrom: context });
            }
        });
        
        this.channel.subscribe("delete.task.request", function (data) {
            context.tasks.remove(function (item) {
                return data.taskId == item.id();
            });
        });

        this.channel.subscribe("add.task.request", function (data) {
            if (data.columnId == context.id()) {
                context.tasks.push(data.entity);
                if (!!data.removedFrom) {
                    context.channel.publish("notification", { message: "'" + data.entity.title() + "' moved to '" + context.title() + "'" });
                }
            }
        });

        var isUpdating = false;
        var setProperty = function (name, value) {
            isUpdating = true;
            context[name](value);
            isUpdating = false;
        };

        this.channel.subscribe("modify.column.property.*", function (data, envelope) {
            if (data.id == context.id()) {
                var properties = envelope.topic.split('.');
                setProperty(properties[properties.length - 1], data.newValue);
            }
        });

        this.title.subscribe(function (newValue) {
            if (isUpdating) return;
            context.privateChannel.publish("modify.column.property.title", { id: context.id(), newValue: newValue, sender: thisInstance });
        });

    };
    
    tasklist.prototype.asJSON = function () {
        return ko.toJSON(this, function (key, value) {
            if (key != "tasks") {
                return value;
            }
            return;
        });
    };

    return function (initial) { return new tasklist(initial || {}); };

});