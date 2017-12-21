(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractTabsSoftwareListController', TicketingContractTabsSoftwareListController);

  function TicketingContractTabsSoftwareListController(
    $scope,
    $modal
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.onAddBtnClick = onAddBtnClick;
      self.onEditBtnClick = onEditBtnClick;
    }

    function onAddBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/contract/tabs/software/add/ticketing-contract-tabs-software-add.html',
        controller: 'TicketingContractTabsSoftwareAddController',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        locals: {
          contract: self.contract
        }
      });
    }

    function onEditBtnClick(software) {
      $modal({
        templateUrl: '/ticketing/app/contract/tabs/software/edit/ticketing-contract-tabs-software-edit.html',
        controller: 'TicketingContractTabsSoftwareEditController',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        locals: {
          software: software,
          contractId: self.contract._id
        }
      });
    }
  }
})(angular);
