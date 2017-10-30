(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserCreateController', TicketingUserCreateController);

  function TicketingUserCreateController(TicketingUserService) {
    var self = this;

    self.create = create;

    function create() {
      return TicketingUserService.create(self.user);
    }
  }
})(angular);
