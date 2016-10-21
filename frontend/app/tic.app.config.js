(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .config(function(dynamicDirectiveServiceProvider) {
      var home = new dynamicDirectiveServiceProvider.DynamicDirective(true, 'tic-application-menu-esn');

      dynamicDirectiveServiceProvider.addInjection('esn-application-menu', home);
    })
    .config(function($translateProvider) {
      $translateProvider.useStaticFilesLoader({
        files: [{
          prefix: './linagora.esn.ticketing/app/locales/web-',
          suffix: '.json'
        }]
      });
      $translateProvider.preferredLanguage('fr');
      $translateProvider.useSanitizeValueStrategy('escape');
    });
})();
