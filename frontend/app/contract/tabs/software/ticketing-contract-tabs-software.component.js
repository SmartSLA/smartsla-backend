(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsSoftware', {
      templateUrl: '/ticketing/app/contract/tabs/software/ticketing-contract-tabs-software.html',
      bindings: {
        contract: '<'
      }
    });
})(angular);
