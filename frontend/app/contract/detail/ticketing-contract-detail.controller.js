(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractDetailController', TicketingContractDetailController);

  function TicketingContractDetailController(
    $stateParams,
    $scope,
    TicketingContractService
  ) {
    var self = this;
    var originContract;
    var DEFAULT_TAB = 'main';

    self.$onInit = $onInit;

    function $onInit() {
      self.contractId = $stateParams.contractId;
      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      TicketingContractService.get(self.contractId)
        .then(function(contract) {
          self.selectedTab = DEFAULT_TAB;
          self.contract = contract;

          $scope.$watch('$ctrl.selectedTab', function(newTab) {
            if (newTab !== DEFAULT_TAB) {
              _reset();
            }
          }, true);
        });
    }

    function onCancelBtnClick() {
      _reset();
    }

    function onEditBtnClick() {
      self.isEditMode = true;
    }

    function onSaveBtnClick() {
      return TicketingContractService.update(self.contract)
        .then(function() {
          self.isEditMode = false;
          originContract = angular.copy(self.contract);
        });
    }

    function _reset() {
      if (self.isEditMode) {
        self.isEditMode = false;
        self.contract = angular.copy(originContract);
      }
    }
  }
})(angular);
