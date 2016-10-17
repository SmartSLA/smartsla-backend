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
        .state('ticketing.clients-add', {
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
              templateUrl: '/linagora.esn.ticketing/app/client/view/tic-client-view.html',
              controller: 'ticClientViewController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            client: function($stateParams, ticClientApiService) {
              if ($stateParams.client) {
                return $stateParams.client;
              }

              return ticClientApiService.getClient($stateParams.clientId).then(function(result) {
                return result.data;
              });
            }
          }
        });
      });
})();
