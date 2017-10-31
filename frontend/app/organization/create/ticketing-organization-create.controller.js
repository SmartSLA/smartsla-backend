(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationCreateController', TicketingOrganizationCreateController);

  function TicketingOrganizationCreateController(TicketingOrganizationService, parent) {
    var self = this;

    self.create = create;

    self.organization = {
      parent: parent,
      manager: parent.manager
    };

    function create() {
      return TicketingOrganizationService.create(self.organization);
    }
  }
})(angular);
