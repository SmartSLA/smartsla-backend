(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingContractService', TicketingContractService);

  function TicketingContractService(
    ticketingContractClient,
    TicketingUserService
  ) {
    return {
      get: get
    };

    function get(contractId) {
      return ticketingContractClient.get(contractId)
        .then(function(response) {
          var contract = response.data;

          if (contract.manager) {
            contract.manager = _denormalizeManager(contract.manager);
          }

          return contract;
        });
    }

    function _denormalizeManager(manager) {
      manager.displayName = TicketingUserService.buildDisplayName(manager) || manager.preferredEmail;
      manager.id = manager._id;

      return manager;
    }
  }
})(angular);
