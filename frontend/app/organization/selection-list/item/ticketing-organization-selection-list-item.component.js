(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationSelectionListItem', {
      templateUrl: '/ticketing/app/organization/selection-list/item/ticketing-organization-selection-list-item.html',
      bindings: {
        organization: '<',
        form: '<'
      }
    });
})(angular);
