define("urlBuilder", function () {
    var app = {
        log: function () {
            ///<summary>Logs to the console</summary>
            try {
                console.log.apply(console, arguments);
            } catch (e) {
                try {
                    opera.postError.apply(opera, arguments);
                } catch (e) {  /* browser doesn't support logging */ }
            }
        },

        navigate: function () {
            var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
            args.unshift("#");
            window.location.hash = args.join('/');
        },

        urlBuilder: function (baseUrl) {
            return function () {
                var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
                args.unshift(baseUrl);
                args.unshift("/api");
                return args.join('/');
            };
        }
    };
    return app;
});
