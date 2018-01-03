(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketService', TicketingTicketService);

  function TicketingTicketService(
    $rootScope,
    asyncAction,
    TicketingTicketClient,
    TICKETING_TICKET_EVENTS
  ) {
    return {
      create: create,
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

    function create(ticket) {
      if (!ticket) {
        return $q.reject(new Error('Ticket is required'));
      }

      var notificationMessages = {
        progressing: 'Creating issue...',
        success: 'Issue created',
        failure: 'Failed to create issue'
      };

      return asyncAction(notificationMessages, function() {
        return TicketingTicketClient.create(ticket);
      }).then(function(response) {
        $rootScope.$broadcast(TICKETING_TICKET_EVENTS.CREATED, buildResponsiblePerson(response.data));
      });
    }
  }
})(angular);
