(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractFormController', TicketingContractFormController);

  function TicketingContractFormController($scope, $stateParams) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.organizationMode = !!$stateParams.organizationId;
      self.onOrganizationChange = onOrganizationChange;
      self.onManagerChange = onManagerChange;
      self.onDefaultSupportManagerChange = onDefaultSupportManagerChange;

      if (self.contract) {
        self.contract.organization.displayName = self.contract.organization.shortName;
        self.organizations = self.contract.organization ? [self.contract.organization] : [];
        self.managers = self.contract.manager ? [self.contract.manager] : [];
        self.defaultSupportManagers = self.contract.defaultSupportManager ? [self.contract.defaultSupportManager] : [];
      } else {
        self.contract = {};
      }
    }

    function onOrganizationChange() {
      self.contract.organization = self.organizations.length ? self.organizations[0] : null;
    }

    function onManagerChange() {
      self.contract.manager = self.managers.length ? self.managers[0] : null;
    }

    function onDefaultSupportManagerChange() {
      self.contract.defaultSupportManager = self.defaultSupportManagers.length ? self.defaultSupportManagers[0] : null;
    }
  }
})(angular);
