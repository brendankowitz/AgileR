define(["models/tasklist", "models/guid"], function (taskListModel, guid) {

    var board = function (from) {
        var context = this;
        this.id = ko.observable(from.Id || from.id),
        this.title = ko.observable(from.Title || from.title);
        this.slug = ko.observable(from.Slug || from.slug || guid());
        this.columns = ko.observableArray([]);

        $.each(from.Columns || from.columns || [], function (i, type) {
            var column = new taskListModel(type);
            context.columns.push(column);
        });
    };

    return function (initial) { return new board(initial || {}); };

});