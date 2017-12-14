(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingContractService', TicketingContractService);

  function TicketingContractService(
    $rootScope,
    $q,
    $log,
    asyncAction,
    notificationFactory,
    esnI18nService,
    ticketingContractClient,
    TicketingUserService,
    TicketingService,
    _,
    TICKETING_CONTRACT_EVENTS
  ) {
    return {
      addDemand: addDemand,
      addSoftware: addSoftware,
      create: create,
      get: get,
      getSearchProvider: getSearchProvider,
      updateBasicInfo: updateBasicInfo,
      updatePermissions: updatePermissions
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

      TicketingService.depopulate(contract, ['manager', 'defaultSupportManager', 'organization']);
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

    function updateBasicInfo(contract) {
      if (!contract) {
        return $q.reject(new Error('Contract is required'));
      }

      var contractToUpdate = angular.copy(contract);

      // only update basic info
      delete contractToUpdate.permissions;
      delete contractToUpdate.software;

      TicketingService.depopulate(contractToUpdate, ['manager', 'defaultSupportManager', 'organization']);

      var notificationMessages = {
        progressing: 'Updating contract...',
        success: 'Contract updated',
        failure: 'Failed to update contract'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.update(contractToUpdate._id, contractToUpdate);
      });
    }

    function updatePermissions(contractId, permissions) {
      if (!contractId) {
        return $q.reject(new Error('contractId is required'));
      }

      if (!permissions) {
        return $q.reject(new Error('permissions is required'));
      }

      var modifiedPermissions = angular.copy(permissions);

      var notificationMessages = {
        progressing: 'Updating permissions...',
        success: 'Permissons updated',
        failure: 'Failed to update permissions'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.updatePermissions(contractId, modifiedPermissions);
      });
    }

    function addSoftware(contractId, software) {
      if (!contractId) {
        return $q.reject(new Error('contractId is required'));
      }

      if (!software) {
        return $q.reject(new Error('software is required'));
      }

      var softwareTemplate = software.template ? software.template._id : null;
      var softwareToAdd = angular.copy(software);

      softwareToAdd.template = softwareTemplate;

      var notificationMessages = {
        progressing: 'Adding software...',
        success: 'Software added',
        failure: 'Failed to add software'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.addSoftware(contractId, softwareToAdd);
      }).then(function() {
        $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.SOFTWARE_ADDED, software);
      });
    }

    function addDemand(contract, demand) {
      if (!contract) {
        return $q.reject(new Error('Contract is required'));
      }

      if (!demand) {
        return $q.reject(new Error('Demand is required'));
      }

      if (_.find(contract.demands, {
        demandType: demand.demandType,
        softwareType: demand.softwareType,
        issueType: demand.issueType
      })) {
        var message = esnI18nService.translate('Demand already exists').toString();

        notificationFactory.weakError('Error', message);

        return $q.reject(new Error(message));
      }

      var notificationMessages = {
        progressing: 'Adding demand...',
        success: 'Demand added',
        failure: 'Failed to add demand'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.addDemand(contract._id, demand);
      }).then(function() {
        $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, demand);
      });
    }

    function getSearchProvider() {
      return {
        objectType: 'contract',
        templateUrl: '/ticketing/app/contract/search-template/ticketing-contract-search-template.html',
        getDisplayName: function(contract) {
          return contract.title;
        },
        search: function(options) {
          return ticketingContractClient.list(options)
            .then(function(response) {
              return response.data;
            }, function(err) {
              $log.error('Error while searching contract:', err);

              return $q.when([]);
            });
        }
      };
    }

    function _denormalizeManager(manager) {
      manager.displayName = TicketingUserService.buildDisplayName(manager) || manager.preferredEmail;
      manager.id = manager._id;

      return manager;
    }
  }
})(angular);
