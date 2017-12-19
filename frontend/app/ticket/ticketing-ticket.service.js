(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketService', TicketingTicketService);

  function TicketingTicketService(TicketingTicketClient) {
    return {
      list: list
    };

    function list(options) {
      return TicketingTicketClient.list(options)
        .then(function(response) {
          return response.data.map(function(ticket) {
              return buildResponsiblePerson(ticket);
            });
        });
    }

    function buildResponsiblePerson(ticket) {
      ticket.responsiblePerson = ticket.supportTechnicians && ticket.supportTechnicians.length > 0 ? ticket.supportTechnicians[0] : ticket.supportManager;

      return ticket;
    }
  }
})(angular);
