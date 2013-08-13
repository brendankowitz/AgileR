define(function() {

    var task = function(from) {
        this.id = from.id;
        this.title = ko.observable(from.title);
        this.description = ko.observable(from.description);
        this.index = ko.observable(from.index);
    };

    return task;
    
});