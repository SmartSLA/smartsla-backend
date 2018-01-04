(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketService', TicketingTicketService);

  function TicketingTicketService(
    $rootScope,
    $q,
    _,
    asyncAction,
    TicketingTicketClient,
    TicketingService,
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
        return _handleCreatingTicket(ticket);
      }).then(function(response) {
        $rootScope.$broadcast(TICKETING_TICKET_EVENTS.CREATED, buildResponsiblePerson(response.data));
      });
    }

    function _handleCreatingTicket(ticket) {
      function _waitForUploaded(uploading) {
        return $q(function(resolve) {
          function checkFlag() {
            if (!uploading) {
              resolve();
            }

            uploading = _.some(ticket.attachments, { status: 'uploading' });
            setTimeout(checkFlag, 1000);
          }

          checkFlag();
        });
      }
      TicketingService.depopulate(ticket, ['contract']);

      if (!ticket.attachments || !ticket.attachments.length) {
        return TicketingTicketClient.create(ticket);
      }

      var uploading = true;

      return _waitForUploaded(uploading)
        .then(function() {
          ticket.attachments = _.map(ticket.attachments, function(attachment) {
            return attachment._id;
          });

          return TicketingTicketClient.create(ticket);
        });
    }
  }
})(angular);
