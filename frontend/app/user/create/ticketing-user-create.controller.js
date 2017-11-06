(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserCreateController', TicketingUserCreateController);

  function TicketingUserCreateController(TicketingUserService, organization) {
    var self = this;

    self.user = {};
    if (organization) {
      self.user.organization = organization;
    }

    self.create = create;

    function create() {
      return TicketingUserService.create(self.user);
    }
  }
})(angular);
