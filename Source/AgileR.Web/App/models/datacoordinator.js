define(["models/board"], function (boardModel) {

    var taskChannel = postal.channel();

    taskChannel.subscribe("load.board.request", function (boardId) {

        var boardJs = {
            id: boardId || 1,
            title: "Board 1",
            columns: [
                {
                    id: "1",
                    title: "Todo",
                    index: 0,
                    tasks: [
                        {
                            id: "1",
                            title: "Task1",
                            description: "Hello",
                            index: 0
                        },
                        {
                            id: "2",
                            title: "Another",
                            description: "Hello",
                            index: 1
                        }
                    ]
                },
                {
                    id: "2",
                    title: "Doing",
                    index: 1,
                    tasks: []
                },
                {
                    id: "3",
                    title: "Done",
                    index: 2,
                    tasks: [
                        {
                            id: "3",
                            title: "I'm done",
                            description: "Hello",
                            index: 1
                        }
                    ]
                }
            ]
        };

        var board = new boardModel(boardJs);
        taskChannel.publish("load.board.response", board);
    });

    var data = function () {

    };

    return data;

});
