define(["models/tasklist", "models/task", "durandal/plugins/ko.draggable", "durandal/plugins/ko.drop"], function (taskListModel, taskModel) {

    var channel = postal.channel();

    var view = function () {
        var context = this;
        this.displayName = ko.observable("Untitled");
        this.columns = ko.observableArray([]);

        this.createTask = function () {
            var model = taskModel({
                title: "New task",
                description: "Hello"
            });
            context.columns()[0].tasks.push(model);
            return false;
        };
        
        this.createColumn = function () {
            var model = taskListModel({
                title: "untitled"
            });
            context.columns.push(model);
            return false;
        };

        this.getTask = function (id) {
            var task;
            $.each(context.columns(), function (i, type) {
                $.each(type.tasks, function (j, subType) {
                    if (subType.id = id) {
                        task = subType;
                        return;
                    }
                });
            });
            return task;
        };

        channel.subscribe("load.board.response", function (data) {
            context.displayName = data.title;
            context.columns = data.columns || ko.observableArray([]);
            if (context.columns().length == 0) {
                var newColumn = taskListModel();
                context.columns.push(newColumn);
            }
        }).once();

        this.activate = function (params) {
            channel.publish("load.board.request", params.boardId);
        };
    };

    view.prototype.viewAttached = function (el) {
        //you can get the view after it's bound and connected to it's parent dom node if you want
        $("#agile-columns .column .cards");

    };

    return view;
});