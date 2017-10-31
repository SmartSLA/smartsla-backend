(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationDetailController', TicketingOrganizationDetailController);

  function TicketingOrganizationDetailController(
    $stateParams,
    TicketingOrganizationService
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.organizationId = $stateParams.organizationId;
      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      TicketingOrganizationService.get(self.organizationId)
        .then(function(organization) {
          self.selectedTab = 'main';
          self.organization = organization;
        });
    }

    function onCancelBtnClick() {
      self.isEditMode = false;
    }

    function onEditBtnClick() {
      self.isEditMode = true;
    }

    function onSaveBtnClick() {
      return TicketingOrganizationService.update(self.organization)
        .then(function() {
          self.isEditMode = false;
        });
    }
  }
})(angular);
