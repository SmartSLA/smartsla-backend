(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationTabsUser', {
      templateUrl: '/ticketing/app/organization/tabs/user/ticketing-organization-tabs-user.html',
      bindings: {
        users: '=',
        onCreateBtnClick: '&'
      }
    });
})(angular);
