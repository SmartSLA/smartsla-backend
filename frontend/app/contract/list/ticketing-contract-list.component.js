(function(angular) {
  angular.module('linagora.esn.ticketing')
    .component('ticketingContractList', {
      templateUrl: '/ticketing/app/contract/list/ticketing-contract-list.html',
      controller: 'TicketingContractListController',
      bindings: {
        organization: '<'
      }
    });
})(angular);
