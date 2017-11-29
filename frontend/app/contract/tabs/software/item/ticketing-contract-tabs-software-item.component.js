(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsSoftwareItem', {
      templateUrl: '/ticketing/app/contract/tabs/software/item/ticketing-contract-tabs-software-item.html',
      bindings: {
        software: '<'
      }
    });
})(angular);
