(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationTabsContract', {
      templateUrl: '/ticketing/app/organization/tabs/contract/ticketing-organization-tabs-contract.html',
      bindings: {
        organization: '<'
      }
    });
})(angular);
