(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationTabsMain', {
      templateUrl: '/ticketing/app/organization/tabs/main/ticketing-organization-tabs-main.html',
      controller: 'TicketingOrganizationTabsMainController',
      bindings: {
        organization: '='
      }
    });
})(angular);
