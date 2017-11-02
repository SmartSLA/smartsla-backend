(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingContractService', TicketingContractService);

  function TicketingContractService(
    $rootScope,
    $q,
    asyncAction,
    ticketingContractClient,
    TicketingUserService,
    TICKETING_CONTRACT_EVENTS
  ) {
    return {
      create: create,
      get: get,
      update: update
    };

    function get(contractId) {
      return ticketingContractClient.get(contractId)
        .then(function(response) {
          var contract = response.data;

          if (contract.manager) {
            contract.manager = _denormalizeManager(contract.manager);
          }

          if (contract.defaultSupportManager) {
            contract.defaultSupportManager = _denormalizeManager(contract.defaultSupportManager);
          }

          return contract;
        });
    }

    function create(contract) {
      if (!contract) {
        return $q.reject(new Error('Contract is required'));
      }

      var manager = angular.copy(contract.manager);
      var organization = angular.copy(contract.organization);

      contract.manager = contract.manager && contract.manager._id ? contract.manager._id : contract.manager;
      contract.defaultSupportManager = contract.defaultSupportManager && contract.defaultSupportManager._id ? contract.defaultSupportManager._id : contract.defaultSupportManager;
      contract.organization = contract.organization && contract.organization._id ? contract.organization._id : contract.organization;
      contract.startDate = new Date();
      contract.endDate = new Date();

      var notificationMessages = {
        progressing: 'Creating contract...',
        success: 'Contract created',
        failure: 'Failed to create contract'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.create(contract);
      }).then(function(response) {
        var createdContract = response.data;

        createdContract.manager = manager;
        createdContract.organization = organization;

        $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.CONTRACT_CREATED, createdContract);
      });
    }

    function update(contract) {
      if (!contract) {
        return $q.reject(new Error('Contract is required'));
      }

      var contractToUpdate = angular.copy(contract);

      contractToUpdate.manager = contractToUpdate.manager && contractToUpdate.manager._id ? contractToUpdate.manager._id : contractToUpdate.manager;
      contractToUpdate.defaultSupportManager = contractToUpdate.defaultSupportManager && contractToUpdate.defaultSupportManager._id ? contractToUpdate.defaultSupportManager._id : contractToUpdate.defaultSupportManager;
      contractToUpdate.organization = contractToUpdate.organization && contractToUpdate.organization._id ? contractToUpdate.organization._id : contractToUpdate.organization;

      var notificationMessages = {
        progressing: 'Updating contract...',
        success: 'Contract updated',
        failure: 'Failed to update contract'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.update(contractToUpdate._id, contractToUpdate);
      });
    }

    function _denormalizeManager(manager) {
      manager.displayName = TicketingUserService.buildDisplayName(manager) || manager.preferredEmail;
      manager.id = manager._id;

      return manager;
    }
  }
})(angular);
