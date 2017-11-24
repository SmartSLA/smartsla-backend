(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationSelectionList', {
      templateUrl: '/ticketing/app/organization/selection-list/ticketing-organization-selection-list.html',
      bindings: {
        organizations: '<',
        form: '<'
      }
    });
})(angular);
