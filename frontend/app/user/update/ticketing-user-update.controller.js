(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserUpdateController', TicketingUserUpdateController);

  function TicketingUserUpdateController(TicketingUserService, user) {
    var self = this;

    self.user = user;
    self.update = update;

    function update() {
      return TicketingUserService.update(self.user);
    }
  }
})(angular);
