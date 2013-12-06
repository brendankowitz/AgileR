define(function () {
    ko.bindingHandlers.htmlValue = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            ko.utils.registerEventHandler(element, "keyup", function () {
                var modelValue = valueAccessor();
                var elementValue = element.innerHTML;
                if (ko.isWriteableObservable(modelValue)) {
                    modelValue(elementValue);
                }
                else { //handle non-observable one-way binding
                    var allBindings = allBindingsAccessor();
                    if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                }
            }
                                         )
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || "";
            if (element.innerHTML !== value) {
                element.innerHTML = value;
            }
        }
    };
});