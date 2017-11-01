(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsMain', {
      templateUrl: '/ticketing/app/contract/tabs/main/ticketing-contract-tabs-main.html',
      bindings: {
        contract: '='
      }
    });
})(angular);
