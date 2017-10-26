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
            default: 'ticketingAdminCenter.organization',
            params: true,
            fn: function() {
              return true;
            }
          },
          resolve: {
            isAdministrator: function($state, session, ticketingProvider) {
              return session.ready.then(function() {
                return ticketingProvider.userIsAdministrator(session.user._id)
                  .then(function(isAdministrator) {
                    if (!isAdministrator) {
                      $state.go('ticketing');
                    }
                  });
              });
            }
          }
        })
        .state('ticketingAdminCenter.organization', {
          url: '/organization',
          views: {
            'admin-root@ticketingAdminCenter': {
              template: '<ticketing-organization />'
            }
          }
        });
    });
})();
