(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsDemandItem', {
      templateUrl: '/ticketing/app/contract/tabs/demand/item/ticketing-contract-tabs-demand-item.html',
      bindings: {
        demand: '<'
      }
    });
})(angular);
