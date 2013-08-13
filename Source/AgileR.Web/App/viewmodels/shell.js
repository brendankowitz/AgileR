define(['durandal/plugins/router', 'durandal/app'], function (router, app, exports) {

    return {
        router: router,
        search: function () {
        },
        
        activate: function () {
            return router.activate('welcome');
        }
    };
});