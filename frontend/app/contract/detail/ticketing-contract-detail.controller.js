(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractDetailController', TicketingContractDetailController);

  function TicketingContractDetailController(
    $stateParams,
    $scope,
    $modal,
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
      self.onCreateOrderBtnClick = onCreateOrderBtnClick;

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

    function onCreateOrderBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/order/create/ticketing-order-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingOrderCreateController',
        locals: {
          contract: self.contract
        }
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
  }
})(angular);
