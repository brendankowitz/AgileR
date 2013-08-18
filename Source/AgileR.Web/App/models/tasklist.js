define(["models/task", "models/guid"], function (taskModel, guid) {

    var tasklist = function (obj) {
        var context = this;
        this.channel = postal.channel();
        this.id = ko.observable(obj.Id || obj.id || guid()),
        this.title = ko.observable(obj.Title || obj.title || "untitled");
        this.tasks = ko.observableArray([]);
        this.index = ko.observable(obj.Index || obj.index || 0);

        $.each(obj.Tasks || obj.tasks || [], function (i, type) {
            var model = new taskModel(type);
            context.tasks.push(model);
        });

        this.channel.subscribe("move.task.request", function (data) {
            var removed = context.tasks.remove(function (item) {
                return data.taskId == item.id();
            });
            if (removed.length > 0) {
                channel.publish("add.task.request", { columnId: data.toColumnId, entity: removed[0] });
            }
        });

        this.channel.subscribe("add.task.request", function (data) {
            if (data.columnId == context.id()) {
                context.tasks.push(data.entity);
            }
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