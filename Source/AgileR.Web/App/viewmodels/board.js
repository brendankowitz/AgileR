define(["models/tasklist", "models/task", "durandal/plugins/ko.draggable", "durandal/plugins/ko.drop"], function (taskListModel, taskModel) {

    var channel = postal.channel();

    var view = function () {
        var context = this;
        this.board = null;
        this.displayName = ko.observable("Untitled");
        this.columns = ko.observableArray([]);

        this.createTask = function () {
            var model = taskModel({
                title: "New task",
                description: "Hello"
            });
            
            channel.publish("insert.task.request", {
                columnId: context.columns()[0].id(),
                entity: model
            });
            
            return false;
        };
        
        this.createColumn = function () {
            var model = taskListModel({
                title: "untitled"
            });
            
            channel.publish("insert.column.request", {
                boardId: context.board.id(),
                entity: model
            });

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
            context.board = data;
            context.displayName = data.title;
            context.columns = data.columns || ko.observableArray([]);
            if (context.columns().length == 0) {
                var newColumn = taskListModel();
                
                channel.publish("insert.column.request", {
                    boardId: context.board.id(),
                    entity: newColumn
                });

            }
        }).once();

        this.activate = function (params) {
            channel.publish("load.board.request", params.boardId);
        };
    };

    view.prototype.viewAttached = function (el) {
        //you can get the view after it's bound and connected to it's parent dom node if you want

    };

    return view;
});