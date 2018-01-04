(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketCreateController', TicketingTicketCreateController);

  function TicketingTicketCreateController(_, TicketingTicketService) {
    var self = this;

    self.create = create;

    function create() {
      return TicketingTicketService.create(self.ticket);
    }
  }
})(angular);
