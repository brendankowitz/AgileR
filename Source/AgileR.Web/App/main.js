requirejs.config({
    paths: {
        'text': '../scripts/text',
        'durandal': '../scripts/durandal',
        'plugins': '../scripts/durandal/plugins',
        'transitions': '../scripts/durandal/transitions',
        'knockout': '../scripts/knockout-2.3.0',
        'bootstrap': '../scripts/bootstrap',
        'jquery': '../scripts/jquery-2.0.3'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define("jquery", function () {

    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    
    return window.jQuery;
});

define(['durandal/app', 'durandal/system', 'durandal/viewLocator', 'plugins/router',
        'plugins/widget', 'viewmodels/toastrEvents', 'models/datacoordinator', 'models/board', 'viewmodels/signalrEvents'],
  function (app, system, viewLocator, router, widget) {

      system.debug(true);

      /*
      app.title = 'AgileR';

      app.start().then(function () {
          //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
          //Look for partial views in a 'views' folder in the root.
          viewLocator.useConvention();

          //configure routing
          //router.useConvention();
          router.mapNav('welcome');
          router.mapRoute('board/:boardId');

          //Show the app by setting the root view model for our application with a transition.
          app.setRoot('viewmodels/shell', 'entrance');
      });*/
      
      app.title = 'AgileR';

      app.configurePlugins({
          router: true,
          dialog: true,
          widget: true
      });

      app.start().then(function () {
          //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
          //Look for partial views in a 'views' folder in the root.
          viewLocator.useConvention();

          //Show the app by setting the root view model for our application with a transition.
          app.setRoot('viewmodels/shell');
      });
  });