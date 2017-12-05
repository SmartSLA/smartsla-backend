(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsDemand', {
      templateUrl: '/ticketing/app/contract/tabs/demand/ticketing-contract-tabs-demand.html',
      bindings: {
        contract: '<',
        newDemand: '=',
        onAddBtnClick: '&'
      }
    });
})(angular);
