(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractDetailController', TicketingContractDetailController);

  function TicketingContractDetailController(
    $stateParams,
    TicketingContractService
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.contractId = $stateParams.contractId;
      TicketingContractService.get(self.contractId)
        .then(function(contract) {
          self.selectedTab = 'main';
          self.contract = contract;
        });
    }
  }
})(angular);
