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

        /*
        //var boardJs = {
        //    id: boardId || 1,
        //    title: "Board 1",
        //    columns: [
        //        {
        //            id: "1",
        //            title: "Todo",
        //            index: 0,
        //            tasks: [
        //                {
        //                    id: "1",
        //                    title: "Task1",
        //                    description: "Hello",
        //                    index: 0
        //                },
        //                {
        //                    id: "2",
        //                    title: "Another",
        //                    description: "Hello",
        //                    index: 1
        //                }
        //            ]
        //        },
        //        {
        //            id: "2",
        //            title: "Doing",
        //            index: 1,
        //            tasks: []
        //        },
        //        {
        //            id: "3",
        //            title: "Done",
        //            index: 2,
        //            tasks: [
        //                {
        //                    id: "3",
        //                    title: "I'm done",
        //                    description: "Hello",
        //                    index: 1
        //                }
        //            ]
        //        }
        //    ]
        //};

        //var board = new boardModel(boardJs);
        */
        
    });

    taskChannel.subscribe("insert.board.request", function(obj) {
        manager.addEntity(obj.entity);
        manager.saveChanges().then(function() {
            internalBoards.push(obj.entity);
        }).fail(function() {
            var toastr = require("toastr");
            toastr.error("Failed to save board :(");
        });
    });

    var data = {
    };

    return data;

});
