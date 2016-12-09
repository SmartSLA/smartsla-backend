(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')

    .config(function($stateProvider) {
      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          views: {
            '': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-home.html'
            },
            'sidebar@ticketing': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-sidebar.html'
            }
          },
          deepStateRedirect: {
            default: 'ticketing.home',
            fn: function() {
              return { state: 'ticketing.home' };
            }
          }
        })
        .state('ticketing.home', {
          url: '/home',
          controller: 'ticHomeController',
          views: {
            'main@ticketing': {
              templateUrl: '/linagora.esn.ticketing/app/home/tic-main.html'
            }
          }
        })
        .state('ticketing.client-add', {
          url: '/clients/add',
          views: {
            'main@ticketing': {
                template: '<tic-client-add />'
            }
          }
        })
        .state('ticketing.clients-list', {
          url: '/clients/list',
          views: {
            'main@ticketing': {
              template: '<tic-clients-list/>'
            }
          }
        })
        .state('ticketing.client-view', {
          url: '/clients/:clientId',
          params: {
            client: null
          },
          views: {
            'main@ticketing': {
              template: '<tic-client-view />'
            }
          }
        })
        .state('ticketing.client-edit', {
          url: '/clients/:clientId/edit',
          params: {
            client: null
          },
          views: {
            'main@ticketing': {
              template: '<tic-client-edit />'
            }
          }
        })
        .state('ticketing.group-add', {
          url: '/groups/add',
          params: {
            client: null
          },
          views: {
            'main@ticketing': {
              template: '<tic-group-add />'
            }
          }
      });
    });
})();
