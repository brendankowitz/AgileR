define(["urlBuilder", "models/board"], function (navigation, boardModel) {

    var taskChannel = postal.channel();
    var url = navigation.urlBuilder("Board");
    var internalBoards = ko.observableArray([]);

    taskChannel.subscribe("load.boards.request", function () {
        $.ajax({
            url: url("boards"),
            dataType: 'json',
            type: "GET",
            accept: 'application/json',
            contentType: 'application/json',
            data: {}
        }).success(function(d) {
            internalBoards.removeAll();
            $.each(d, function (i, type) {
                internalBoards.push(boardModel(type));
            });
            taskChannel.publish("load.boards.response", internalBoards);
        }).fail(function () {
            toastr.error("Boards could not be loaded.");
        });
    });

    taskChannel.subscribe("load.board.request", function (boardId) {
        var findBoard = function() {
            $.each(internalBoards(), function(i, type) {
                if (boardId === type.slug()) {
                    taskChannel.publish("load.board.response", type);
                }
            });
        };

        if (internalBoards().length > 0) {
            findBoard();
        } else {
            taskChannel.subscribe("load.boards.response", function(d) {
                findBoard();
            }).once();
            channel.publish("load.boards.request");
        }     
    });

    taskChannel.subscribe("add.board.request", function (obj) {
        internalBoards.push(obj.entity);
    });

    taskChannel.subscribe("insert.board.request", function(obj) {
        $.ajax({
            url: url("create"),
            dataType: 'json',
            type: "POST",
            accept: 'application/json',
            contentType: 'application/json',
            data: obj.entity.asJSON()
        }).success(function (d) {
            obj.entity.id(d.Id);
            taskChannel.publish("add.board.request", obj);
            taskChannel.publish("notification", { message: obj.entity.title() + " saved." });
        }).fail(function() {
            taskChannel.publish("notification.error", { message: "Failed to save board :(" });
        });
    });
    
    taskChannel.subscribe("insert.column.request", function (obj) {
        $.ajax({
            url: url("createcolumn", "?boardId=" + obj.boardId),
            dataType: 'json',
            type: "POST",
            accept: 'application/json',
            contentType: 'application/json',
            data: obj.entity.asJSON()
        }).success(function (d) {
            obj.entity.id(d.Id);
            taskChannel.publish("add.column.request", obj);
            taskChannel.publish("notification", { message: obj.entity.title() + " saved." });
        }).fail(function () {
            taskChannel.publish("notification.error", { message: "Failed to save column :(" });
        });
    });
    
    taskChannel.subscribe("insert.task.request", function (obj) {
        $.ajax({
            url: url("createtask", "?columnId=" + obj.columnId),
            dataType: 'json',
            type: "POST",
            accept: 'application/json',
            contentType: 'application/json',
            data: obj.entity.asJSON()
        }).success(function (d) {
            obj.entity.id(d.Id);
            taskChannel.publish("add.task.request", obj);
            taskChannel.publish("notification", { message: obj.entity.title() + " saved." });
        }).fail(function () {
            taskChannel.publish("notification.error", { message: "Failed to save task :(" });
        });
    });

    var data = {
        boards: internalBoards
    };

    return data;

});
