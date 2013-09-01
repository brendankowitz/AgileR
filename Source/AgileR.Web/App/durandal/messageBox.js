define(function() {
    var MessageBox = function(message, title, options) {
        this.message = message;
        this.title = title || MessageBox.defaultTitle;
        this.options = options || MessageBox.defaultOptions;
    };

    MessageBox.prototype.selectOption = function (dialogResult) {
        this.modal.close(dialogResult);
    };

    MessageBox.prototype.activate = function(config) {
        if (config) {
            this.message = config.message;
            this.title = config.title || MessageBox.defaultTitle;
            this.options = config.options || MessageBox.defaultOptions;
        }
        
    };

    MessageBox.prototype.viewAttached = function (el) {
        //$(el).modal({ show: true });
    };

    MessageBox.defaultTitle = 'Application';
    MessageBox.defaultOptions = ['Ok'];

    return MessageBox;
});