(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationDetailController', TicketingOrganizationDetailController);

  function TicketingOrganizationDetailController(
    $stateParams,
    $scope,
    $modal,
    TicketingOrganizationService
  ) {
    var self = this;
    var originOrganization;
    var DEFAULT_TAB = 'main';

    self.$onInit = $onInit;

    function $onInit() {
      self.organizationId = $stateParams.organizationId;
      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      self.onCreateContractBtnClick = onCreateContractBtnClick;
      TicketingOrganizationService.get(self.organizationId)
        .then(function(organization) {
          self.selectedTab = DEFAULT_TAB;
          self.organization = organization;
          originOrganization = angular.copy(organization);

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
      return TicketingOrganizationService.update(self.organization)
        .then(function() {
          self.isEditMode = false;
          originOrganization = angular.copy(self.organization);
        });
    }

    function onCreateContractBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/contract/create/ticketing-contract-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingContractCreateController',
        locals: {
          organization: self.organization
        }
      });
    }

    function _reset() {
      if (self.isEditMode) {
        self.isEditMode = false;
        self.organization = angular.copy(originOrganization);
      }
    }
  }
})(angular);
