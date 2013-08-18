define(["models/datacoordinator", "models/board"], function (datacoordinator, boardModel) {

    var channel = postal.channel();

    var welcome = function () {
        var context = this;
        this.displayName = 'Task Boards';
        this.boards = ko.observableArray([]);
        this.newBoard = boardModel();
        this.createNewBoard = function() {
            channel.publish("insert.board.request", { entity: context.newBoard });
            return false;
        };

        channel.subscribe("load.boards.response", function(data) {
            context.boards(data());
        }).once();

        channel.publish("load.boards.request");
    };

    welcome.prototype.viewAttached = function (view) {
        //you can get the view after it's bound and connected to it's parent dom node if you want
       
        
        
    };

    return welcome;
});