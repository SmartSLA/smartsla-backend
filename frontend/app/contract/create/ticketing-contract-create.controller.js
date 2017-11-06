(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractCreateController', TicketingContractCreateController);

  function TicketingContractCreateController(TicketingContractService, organization) {
    var self = this;

    self.create = create;

    if (organization) {
      self.contract = {
        organization: organization
      };
    }

    function create() {
      self.contract.organization = self.contract.organization && self.contract.organization._id ? self.contract.organization._id : self.contract.organization;

      return TicketingContractService.create(self.contract);
    }
  }
})(angular);
