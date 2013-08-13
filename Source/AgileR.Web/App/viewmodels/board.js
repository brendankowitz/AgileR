define(["models/tasklist", "models/task", "durandal/plugins/ko.draggable"], function (taskListModel, taskModel) {

    var channel = postal.channel();

    var view = function (boardId) {
        var context = this;
        this.displayName = ko.observable("Untitled");
        this.columns = ko.observableArray([]);

        this.createTask = function () {

            context.columns()[0].tasks.push(new taskModel({
                title: "New task",
                description: "Hello"
            }));

            return false;

        };

        this.getTask = function (id) {
            var task;
            $.each(context.columns(), function(i, type) {
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
            context.columns = data.columns;
        });

        channel.publish("load.board.request", boardId);
    };

    view.prototype.viewAttached = function (el) {
        //you can get the view after it's bound and connected to it's parent dom node if you want

        $(".draggable").draggable({ cursor: "move", revert: "invalid" });
        $("#agile-columns .column .cards").droppable({
            accept: ".draggable",
            drop: function (event, ui) {
                
                $(this).parents(".column").removeClass("border").removeClass("over");
                var dropped = ui.draggable;
                var droppedOn = $(this);
                $(dropped).detach();

                channel.publish("move.task.request", { taskId: $(dropped).data("id"), toColumnId: droppedOn.closest(".column").data("id") });
                channel.publish("notification", { message: "'" + $(dropped).text() + "' moved to '" + droppedOn.parents(".column").find("h2").text() + "'" });
            },
            over: function (event, elem) {
                $(this).closest(".column").addClass("over");
            },
            out: function (event, elem) {
                $(this).closest(".column").removeClass("over");
            }
        }).find(".draggable").click(function() {
            var app = require('durandal/app');
            app.showMessage("<strong>"+$(this).text()+"</strong");
        });
        $("#agile-columns .column .draggable").sortable();
        
    };

    return view;
});