(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationTabs', {
      templateUrl: '/ticketing/app/organization/tabs/ticketing-organization-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
