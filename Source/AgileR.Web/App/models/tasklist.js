define(["models/task"], function (taskModel) {

    var channel = postal.channel();

    var tasklist = function(obj) {
        var context = this;
        this.id = obj.id;
        this.title = ko.observable(obj.title || "untitled");
        this.tasks = ko.observableArray([]);
        this.index = ko.observable(obj.index || 0);

        if (!!obj.tasks) {
            $.each(obj.tasks, function(i, type) {
                var model = new taskModel(type);
                context.tasks.push(model);
            });
        }

        channel.subscribe("move.task.request", function (data) {
            var removed = context.tasks.remove(function (item) {
                return data.taskId == item.id;
            });
            if (removed.length > 0) {
                channel.publish("add.task.request", { columnId: data.toColumnId, task: removed[0] });
            }

            if (data.toColumnId == context.id) {
                context.tasks.push();
            }
        });
        
        channel.subscribe("add.task.request", function (data) {
            if (data.columnId == context.id) {
                context.tasks.push(data.task);
            }
        });
    };

    return tasklist;

});