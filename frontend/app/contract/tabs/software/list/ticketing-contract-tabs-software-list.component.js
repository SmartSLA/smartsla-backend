(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsSoftwareList', {
      templateUrl: '/ticketing/app/contract/tabs/software/list/ticketing-contract-tabs-software-list.html',
      controller: 'TicketingContractTabsSoftwareListController',
      bindings: {
        contract: '<'
      }
    });
})(angular);
