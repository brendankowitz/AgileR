define(["models/tasklist", "models/guid"], function (taskListModel, guid) {

    var board = function (from) {
        var context = this;
        this.channel = postal.channel();
        this.id = ko.observable(from.Id || from.id),
        this.title = ko.observable(from.Title || from.title);
        this.slug = ko.observable(from.Slug || from.slug || guid());
        this.columns = ko.observableArray([]);

        $.each(from.Columns || from.columns || [], function (i, type) {
            var column = new taskListModel(type);
            context.columns.push(column);
        });
        
        this.channel.subscribe("add.column.request", function (data) {
            if (data.boardId == context.id()) {
                context.columns.push(data.entity);
            }
        });
    };

    board.prototype.asJSON = function() {
        return ko.toJSON(this, function(key, value) {
            if (key != "columns") {
                return value;
            }
            return;
        });
    };

    return function (initial) { return new board(initial || {}); };

});