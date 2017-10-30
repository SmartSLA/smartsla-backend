(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationTabsMainController', TicketingOrganizationTabsMainController);

  function TicketingOrganizationTabsMainController(
    TicketingUserService,
    TicketingOrganizationService
  ) {
    var self = this;
    var originOrganization;

    self.$onInit = $onInit;

    function $onInit() {
      self.onCancelBtnClick = onCancelBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      self.newManagers = _determineNewManagers(self.organization);
      originOrganization = angular.copy(self.organization);
    }

    function onCancelBtnClick() {
      self.organization = angular.copy(originOrganization);
      self.newManagers = _determineNewManagers(self.organization);
    }

    function onSaveBtnClick() {
      self.organization.manager = self.newManagers[0];
      var organization = _qualifyOrganization(self.organization);

      return TicketingOrganizationService.update(organization)
        .then(function() {
          originOrganization = angular.copy(self.organization); //update origin organization state
        });
    }

    function _determineNewManagers(organization) {
      return organization.manager ? [_denormalizeManager(organization.manager)] : [];
    }

    function _denormalizeManager(manager) {
      manager.displayName = manager ? TicketingUserService.buildDisplayName(manager) : manager.email;
      manager.id = manager._id;

      return manager;
    }

    function _qualifyOrganization(organization) {
      organization.manager = organization.manager ? organization.manager._id : null;

      return organization;
    }
  }
})(angular);
