(function() {
  'use strict';

  var MODULE_NAME = 'linagora.esn.ticketing';

  angular.module(MODULE_NAME)

    .config(function($stateProvider) {
      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          template: '<h2>This is ticketing state</h2>'
        });
    });
})();
