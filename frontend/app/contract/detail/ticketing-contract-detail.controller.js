(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractDetailController', TicketingContractDetailController);

  function TicketingContractDetailController(
    $stateParams,
    $scope,
    $modal,
    _,
    TicketingContractService,
    TICKETING_CONTRACT_EVENTS
  ) {
    var self = this;
    var DEFAULT_TAB = 'permission';
    var originContract;

    self.$onInit = $onInit;

    function $onInit() {
      self.contractId = $stateParams.contractId;

      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      self.onAddDemandBtnClick = onAddDemandBtnClick;

      TicketingContractService.get(self.contractId)
        .then(function(contract) {
          self.selectedTab = DEFAULT_TAB;
          self.contract = contract;
          originContract = angular.copy(self.contract);

          $scope.$watch('$ctrl.selectedTab', function(newTab) {
            if (newTab !== DEFAULT_TAB) {
              _reset();
            }
          }, true);
        });

      $scope.$on(TICKETING_CONTRACT_EVENTS.SOFTWARE_ADDED, function(event, software) {
        _onSoftwareAdded(software);
      });

      $scope.$on(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, function(event, demand) {
        _onDemandAdded(demand);
      });

      $scope.$on(TICKETING_CONTRACT_EVENTS.SOFTWARE_UPDATED, function(event, software) {
        _onSoftwareUpdated(software);
      });
    }

    function onCancelBtnClick() {
      _reset();
    }

    function onEditBtnClick() {
      self.isEditMode = true;
    }

    function onSaveBtnClick() {
      // update permissions
      if (self.selectedTab === DEFAULT_TAB) {
        var permissionsToUpdate = _buildPermissionsToUpdate(self.contract.permissions);

        return TicketingContractService.updatePermissions(self.contract._id, { permissions: permissionsToUpdate });
      }

      // update basic info
      if (self.selectedTab === 'main') {
        return TicketingContractService.updateBasicInfo(self.contract)
          .then(function() {
            self.isEditMode = false;
            originContract = angular.copy(self.contract);
          });
      }
    }

    function onAddDemandBtnClick(demandForm) {
      return TicketingContractService.addDemand(self.contract, self.newDemand)
        .then(function() {
          demandForm.$setUntouched();
          self.newDemand = {};
        });
    }

    function _reset() {
      if (self.isEditMode) {
        self.isEditMode = false;
        self.contract = angular.copy(originContract);
      }
    }

    function _buildPermissionsToUpdate(permissions) {
      var selectedPermissions = permissions.filter(function(permission) {
        return permission.selected;
      });

      if (selectedPermissions.length === permissions.length) { // all entities have permission
        return 1;
      }

      return selectedPermissions.map(function(permission) { // no or some entities have permission
          return permission._id;
        });
    }

    function _onSoftwareAdded(software) {
      self.contract.software.unshift(software);
    }

    function _onDemandAdded(demand) {
      self.contract.demands.unshift(demand);
    }

    function _onSoftwareUpdated(software) {
      if (!software) {
        return;
      }

      var index = _.findIndex(self.contract.software, function(item) {
        return item.template._id === software.template._id;
      });

      if (index !== -1) {
        self.contract.software[index] = software;
      }
    }
  }
})(angular);
