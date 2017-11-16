(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractFormController', TicketingContractFormController);

  function TicketingContractFormController($scope, $stateParams, TicketingService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.organizationMode = !!$stateParams.organizationId;
      self.contract = self.contract || {};
      TicketingService.handleAutoCompleteWithOneTag($scope, self.contract, {
        newManagers: 'manager',
        newDefaultSupportManagers: 'defaultSupportManager',
        newOrganizations: 'organization'
      });
    }
  }
})(angular);
