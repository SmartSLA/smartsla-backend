(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketCreateController', TicketingTicketCreateController);

  function TicketingTicketCreateController(_, TicketingTicketService, TicketingService) {
    var self = this;

    self.create = create;

    function create() {
      var ticketToCreate = _qualifyTicket(self.ticket);

      return TicketingTicketService.create(ticketToCreate);
    }

    function _qualifyTicket(ticket) {
      var result = angular.copy(ticket);

      TicketingService.depopulate(result, ['contract']);

      if (result.attachments && result.attachments.length) {
        result.attachments = _.map(result.attachments, function(attachment) {
          return attachment._id;
        });
      }

      return result;
    }
  }
})(angular);
