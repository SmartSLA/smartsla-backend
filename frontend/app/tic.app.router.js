(function() {
  /*eslint strict: [2, "function"]*/

  'use strict';

  angular.module('linagora.esn.ticketing')

    .config(function($stateProvider) {
      $stateProvider.state('ticketing', {
        url: '/ticketing',
        templateUrl: '/linagora.esn.ticketing/app/ticketing/tic-home.html',
        controller: 'ticController'
      });
    });

})();
