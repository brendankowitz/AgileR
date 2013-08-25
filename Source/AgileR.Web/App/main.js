requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define("jquery", function () {
    return window.jQuery;
});

define(['durandal/app', 'durandal/system', 'durandal/viewLocator', 'durandal/plugins/router',
        'durandal/widget', 'viewmodels/toastrEvents', 'models/datacoordinator', 'models/board', 'viewmodels/signalrEvents'],
  function (app, system, viewLocator, router, widget) {

      system.debug(true);

      app.title = 'AgileR';

      app.start().then(function () {
          //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
          //Look for partial views in a 'views' folder in the root.
          viewLocator.useConvention();

          app.adaptToDevice();
          //widget.registerKind('tile');

          //configure routing
          router.useConvention();
          router.mapNav('welcome');
          router.mapRoute('board/:boardId');

          app.adaptToDevice();

          //Show the app by setting the root view model for our application with a transition.
          app.setRoot('viewmodels/shell', 'entrance');
      });
  });