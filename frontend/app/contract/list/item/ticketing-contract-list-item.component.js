(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingContractListItem', {
    templateUrl: '/ticketing/app/contract/list/item/ticketing-contract-list-item.html',
    bindings: {
      contract: '<'
    }
  });
})(angular);
