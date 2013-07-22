define([], function () {
    
    var welcome = function () {
        this.displayName = 'Task Boards';
        
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            'Clean MV* Architecture',
            'JS & HTML Modularity',
            'Simple App Lifecycle',
            'Eventing, Modals, Message Boxes, etc.',
            'Navigation & Screen State Management',
            'Consistent Async Programming w/ Promises',
            'App Bundling and Optimization',
            'Use any Backend Technology',
            'Built on top of jQuery, Knockout & RequireJS',
            'Integrates with other libraries such as SammyJS & Bootstrap',
            'Make jQuery & Bootstrap widgets templatable and bindable (or build your own widgets).'
        ];
    };

    welcome.prototype.viewAttached = function (view) {
        //you can get the view after it's bound and connected to it's parent dom node if you want
       

        $(".draggable").draggable({ cursor: "crosshair", revert: "invalid" });
        $("#agile-columns .column").droppable({
            accept: ".draggable",
            drop: function (event, ui) {
                console.log("drop");
                $(this).removeClass("border").removeClass("over");
                var dropped = ui.draggable;
                var droppedOn = $(this);
                $(dropped).detach().css({ top: 0, left: 0 }).appendTo(droppedOn);


            },
            over: function (event, elem) {
                $(this).addClass("over");
                console.log("over");
            }
                        ,
            out: function (event, elem) {
                $(this).removeClass("over");
            }
        }).find(".draggable").click(function() {
            var app = require('durandal/app');
            app.showMessage($(this).text());
        });
        $("#agile-columns .column").sortable();
        
    };

    return welcome;
});