(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationSelectionListSubheader', {
      templateUrl: '/ticketing/app/organization/selection-list/subheader/ticketing-organization-selection-list-subheader.html',
      controller: 'TicketingOrganizationSelectionListSubheaderController',
      bindings: {
        organizations: '<',
        total: '<'
      }
    });
})(angular);
