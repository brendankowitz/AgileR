define(function () {
    ko.bindingHandlers.drag = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var dragOptions = {
                revert: "invalid",
                cursor: 'default'
            };
            dragElement.draggable(dragOptions).disableSelection();
        }
    };
});
