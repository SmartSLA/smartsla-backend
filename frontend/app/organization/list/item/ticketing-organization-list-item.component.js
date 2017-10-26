(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingOrganizationListItem', {
    templateUrl: '/ticketing/app/organization/list/item/ticketing-organization-list-item.html',
    bindings: {
      organization: '<'
    }
  });
})(angular);
