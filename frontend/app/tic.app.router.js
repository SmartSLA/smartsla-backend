(function() {
  /*eslint strict: [2, "function"]*/

  'use strict';

  angular.module('linagora.esn.ticketing')

    .config(function($stateProvider) {
      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          views: {
            '': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-home.html',
              controller: 'ticHomeController'
            },
            'main@ticketing': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-main.html'
            },
            'subheader@ticketing': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-subheader.html'
            },
            'sidebar@ticketing': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-sidebar.html'
            }
          }
        });
      });

})();
