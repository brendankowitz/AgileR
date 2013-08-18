define(["models/task", "models/guid"], function (taskModel, guid) {

    var channel = postal.channel();

    var tasklist = function (obj) {
        var context = this;
        this.id = ko.observable(obj.jId || obj.id || guid()),
        this.title = ko.observable(obj.Title || obj.title || "untitled");
        this.tasks = ko.observableArray([]);
        this.index = ko.observable(obj.Index || obj.index || 0);

        $.each(obj.Tasks || obj.tasks || [], function (i, type) {
            var model = new taskModel(type);
            context.tasks.push(model);
        });

        channel.subscribe("move.task.request", function (data) {
            var removed = context.tasks.remove(function (item) {
                return data.taskId == item.id();
            });
            if (removed.length > 0) {
                channel.publish("add.task.request", { columnId: data.toColumnId, task: removed[0] });
            }

            if (data.toColumnId == context.id()) {
                context.tasks.push();
            }
        });

        channel.subscribe("add.task.request", function (data) {
            if (data.columnId == context.id()) {
                context.tasks.push(data.task);
            }
        });
    };

    return function (initial) { return new tasklist(initial || {}); };

});