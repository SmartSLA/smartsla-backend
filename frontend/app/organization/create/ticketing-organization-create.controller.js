(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationCreateController', TicketingOrganizationCreateController);

  function TicketingOrganizationCreateController(TicketingOrganizationService) {
    var self = this;

    self.create = create;

    function create() {
      var administrator = self.newManagers ? self.newManagers[0] : null;

      return TicketingOrganizationService.create(self.organization, administrator);
    }
  }
})(angular);
