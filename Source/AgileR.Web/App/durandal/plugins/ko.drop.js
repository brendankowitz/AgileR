define(function () {
    var channel = postal.channel();

    ko.bindingHandlers.drop = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            dragElement.droppable({
                accept: ".draggable",
                drop: function(event, ui) {

                    $(this).parents(".column").removeClass("border").removeClass("over");
                    var dropped = ui.draggable;
                    var droppedOn = $(this);
                    $(dropped).detach();
                    channel.publish("move.task.request", { taskId: $(dropped).data("id"), toColumnId: droppedOn.closest(".column").data("id") });
                },
                over: function(event, elem) {
                    $(this).closest(".column").addClass("over");
                },
                out: function(event, elem) {
                    $(this).closest(".column").removeClass("over");
                }
            });
            dragElement.sortable();
        }
    };
});