(function() {
  'use strict';

  var MODULE_NAME = 'linagora.esn.ticketing';

  angular.module(MODULE_NAME)
    .config(function($stateProvider) {
      $stateProvider
        .state('ticketing', {
          url: '/ticketing',
          templateUrl: '/ticketing/app/app.html',
          deepStateRedirect: {
            default: 'ticketing.tickets',
            params: true,
            fn: function() {
              return true;
            }
          }
        })
        .state('ticketing.tickets', {
          url: '/issues',
          deepStateRedirect: {
            default: 'ticketing.tickets.mine',
            params: true,
            fn: function() {
              return true;
            }
          }
        })
        .state('ticketing.tickets.mine', {
          url: '/mine',
          views: {
            'root@ticketing': {
              template: '<ticketing-ticket scope="mine" />'
            }
          }
        })
        .state('ticketing.tickets.all', {
          url: '/all',
          views: {
            'root@ticketing': {
              template: '<ticketing-ticket />'
            }
          },
          resolve: {
            hasPermission: function($state, session, ticketingUserClient, TICKETING_USER_ROLES) {
              return ticketingUserClient.getRole()
                .then(function(response) {
                  if ([TICKETING_USER_ROLES.administrator, TICKETING_USER_ROLES.supporter].indexOf(response.data) === -1) {
                    $state.go('ticketing');
                  }
                })
                .catch(function() {
                  $state.go('ticketing');
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
            hasPermission: function($state, ticketingUserClient, TICKETING_USER_ROLES) {
              return ticketingUserClient.getRole()
                .then(function(response) {
                  if (response.data !== TICKETING_USER_ROLES.administrator) {
                    $state.go('ticketing');
                  }
                })
                .catch(function() {
                  $state.go('ticketing');
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
