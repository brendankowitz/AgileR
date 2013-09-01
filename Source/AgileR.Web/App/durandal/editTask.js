define(["models/task"], function (taskModel) {

    var channel = postal.channel();

    var EditTask = function (message, title, task, options) {

        var context = this;
        this.message = message;
        this.title = title || EditTask.defaultTitle;
        this.options = options || EditTask.defaultOptions;
        this.task = task || new taskModel();
        
        this.deleteTask = function () {
            channel.publish("delete.task.request", { taskId: context.task.id() });
        };
    };

    EditTask.prototype.selectOption = function (dialogResult) {
        this.modal.close(dialogResult);
    };

    EditTask.prototype.activate = function (config) {
        if (config) {
            this.message = config.message;
            this.title = config.title || EditTask.defaultTitle;
            this.options = config.options || EditTask.defaultOptions;
            this.task = config.task || new taskModel();
        }

    };
    
    EditTask.prototype.viewAttached = function (el) {
 
    };

    EditTask.defaultTitle = 'Application';
    EditTask.defaultOptions = ['Ok'];

    return EditTask;
});