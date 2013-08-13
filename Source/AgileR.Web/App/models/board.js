define(["models/tasklist"], function(taskListModel) {

    var board = function (from) {
        var context = this;
        this.id = from.id,
        this.title = ko.observable(from.title);
        this.columns = ko.observableArray([]);
        
        if (!!from.columns) {
            $.each(from.columns, function(i, type) {
                var column = new taskListModel(type);
                context.columns.push(column);
            });
        }
    };

    return board;

});