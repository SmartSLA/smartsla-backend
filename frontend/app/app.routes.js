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
    .config(function($stateProvider) {
      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          template: '<h1>This is ticketing state</h1>',
          resolve: {
            isAdministrator: function($location, session, ticketingProvider) {
              return session.ready.then(function() {
                return ticketingProvider.userIsAdministrator(session.user._id)
                  .catch(function() {
                    $location.path('/');
                  });
              });
            }
          }
        })
        .state('ticketingAdminCenter', {
          url: '/ticketing/admin',
          templateUrl: '/ticketing/app/admin/ticketing-admin.html',
          deepStateRedirect: {
            default: 'ticketingAdminCenter.contract',
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
        .state('ticketingAdminCenter.settings', {
          url: '/settings',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-settings />'
            }
          }
        })
        .state('ticketingAdminCenter.organization', {
          url: '/organizations',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-organization />'
            }
          }
        })
        .state('ticketingAdminCenter.users', {
          url: '/users',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-user />'
            }
          }
        })
        .state('ticketingAdminCenter.users.detail', {
          url: '/:userId',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-user-detail />'
            }
          }
        })
        .state('ticketingAdminCenter.contract', {
          url: '/contracts',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-contract />'
            }
          }
        })
        .state('ticketingAdminCenter.organization.detail', {
          url: '/:organizationId',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-organization-detail />'
            }
          }
        })
        .state('ticketingAdminCenter.contract.detail', {
          url: '/:contractId',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-contract-detail />'
            }
          }
        })
        .state('ticketingAdminCenter.orderDetail', {
          url: '/orders/:orderId',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-order-detail />'
            }
          }
        });
    });
})();
