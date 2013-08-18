define(["models/guid"], function(guid) {

    var task = function(from) {
        this.id = ko.observable(from.Id || from.id || guid()),
        this.title = ko.observable(from.Title || from.title);
        this.description = ko.observable(from.Description || from.description);
        this.index = ko.observable(from.Index || from.index);
    };

    return function (initial) { return new task(initial || {}); };
    
});