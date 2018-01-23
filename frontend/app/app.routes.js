(function() {
  'use strict';

  var MODULE_NAME = 'linagora.esn.ticketing';

  angular.module(MODULE_NAME)

    .provider('ticketingProvider', function() {
      this.$get = function($http) {
        return {
          userIsAdministrator: userIsAdministrator
        };

        function userIsAdministrator(userId) {
          return $http({
            method: 'GET',
            url: '/ticketing/api/users/' + userId + '/isadministrator'
          }).then(function(response) {
            return response.data;
          });
        }
      };
    })
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.when('/ticketing/issues', function($location, session, ticketingProvider) {
        ticketingProvider.userIsAdministrator(session.user._id)
          .then(function(isAdministrator) {
            if (isAdministrator) {
              return $location.path('/ticketing/issues/all');
            }

            return $location.path('/ticketing');
          });
      });

      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          templateUrl: '/ticketing/app/app.html'
        })
        .state('ticketing.tickets', {
          abstract: true,
          url: '/issues'
        })
        .state('ticketing.tickets.all', {
          url: '/all',
          views: {
            'root@ticketing': {
              template: '<ticketing-ticket />'
            }
          },
          resolve: {
            isAdministrator: function($location, session, ticketingProvider) {
              return session.ready.then(function() {
                return ticketingProvider.userIsAdministrator(session.user._id)
                  .then(function(isAdministrator) {
                    if (!isAdministrator) {
                      $location.path('/ticketing');
                    }
                  });
              });
            }
          }
        })
        .state('ticketing.tickets.detail', {
          url: '/:ticketId',
          views: {
            'root@ticketing': {
              template: '<ticketing-ticket-detail />'
            }
          }
        })
        .state('ticketing.admin', {
          url: '/admin',
          views: {
            'root@ticketing': {
              templateUrl: '/ticketing/app/admin/ticketing-admin.html'
            }
          },
          deepStateRedirect: {
            default: 'ticketing.admin.contract',
            params: true,
            fn: function() {
              return true;
            }
          },
          resolve: {
            isAdministrator: function($location, session, ticketingProvider) {
              return session.ready.then(function() {
                return ticketingProvider.userIsAdministrator(session.user._id)
                  .then(function(isAdministrator) {
                    if (!isAdministrator) {
                      $location.path('/ticketing');
                    }
                  });
              });
            }
          }
        })
        .state('ticketing.admin.demands', {
          url: '/demands',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-demand />'
            }
          }
        })
        .state('ticketing.admin.organization', {
          url: '/organizations',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-organization />'
            }
          }
        })
        .state('ticketing.admin.organization.detail', {
          url: '/:organizationId',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-organization-detail />'
            }
          }
        })
        .state('ticketing.admin.users', {
          url: '/users',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-user />'
            }
          }
        })
        .state('ticketing.admin.users.detail', {
          url: '/:userId',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-user-detail />'
            }
          }
        })
        .state('ticketing.admin.contract', {
          url: '/contracts',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-contract />'
            }
          }
        })
        .state('ticketing.admin.contract.detail', {
          url: '/:contractId',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-contract-detail />'
            }
          }
        })
        .state('ticketing.admin.software', {
          url: '/softwares',
          views: {
            'admin-root@ticketing.admin': {
              template: '<ticketing-software />'
            }
          }
        });
    });
})();
