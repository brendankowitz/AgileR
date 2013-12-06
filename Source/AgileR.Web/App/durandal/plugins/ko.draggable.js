define(function () {
    
    var channel = postal.channel();

    ko.bindingHandlers.drag = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var dragOptions = {
                revert: "invalid",
                cursor: 'default',
                drag: function () {
                    var obj = $(this).position();
                    channel.publish("drag.task.request", { left: obj.left, top: obj.top });
                }
            };
            dragElement.draggable(dragOptions).disableSelection();
        }
    };
});
