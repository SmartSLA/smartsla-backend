(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationCreateController', TicketingOrganizationCreateController);

  function TicketingOrganizationCreateController(TicketingOrganizationService) {
    var self = this;

    self.create = create;

    function create() {
      return TicketingOrganizationService.create(self.organization);
    }
  }
})(angular);
