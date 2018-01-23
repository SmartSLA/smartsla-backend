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
    TicketingUserService,
    TICKETING_TICKET_EVENTS
  ) {
    return {
      create: create,
      get: get,
      list: list,
      setWorkaroundTime: setWorkaroundTime,
      unsetWorkaroundTime: unsetWorkaroundTime,
      setCorrectionTime: setCorrectionTime,
      unsetCorrectionTime: unsetCorrectionTime
    };

    function list(options) {
      return TicketingTicketClient.list(options)
        .then(function(response) {
          return response.data.map(function(ticket) {
              return _buildResponsiblePerson(ticket);
            });
        });
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
        $rootScope.$broadcast(TICKETING_TICKET_EVENTS.CREATED, _buildResponsiblePerson(response.data));
      });
    }

    function get(ticketId) {
      return TicketingTicketClient.get(ticketId)
        .then(function(response) {
          var ticket = response.data;

          if (ticket.requester) {
            ticket.requester.displayName = TicketingUserService.buildDisplayName(ticket.requester);
          }
          if (ticket.supportManager) {
            ticket.supportManager.displayName = TicketingUserService.buildDisplayName(ticket.supportManager);
          }

          ticket.supportTechnicians = _.map(ticket.supportTechnicians, function(supportTechnician) {
            supportTechnician.displayName = TicketingUserService.buildDisplayName(supportTechnician);

            return supportTechnician;
          });
          ticket.attachments = _.map(ticket.attachments, function(attachment) {
            attachment.name = attachment.filename;

            return attachment;
          });

          return ticket;
        });
    }

    function setWorkaroundTime(ticketId) {
      if (!ticketId) {
        return $q.reject(new Error('ticketId is required'));
      }

      var notificationMessages = {
        progressing: 'Setting workaround time...',
        success: 'Workaround time is set',
        failure: 'Failed to set workaround time'
      };

      return asyncAction(notificationMessages, function() {
        return TicketingTicketClient.setWorkaroundTime(ticketId)
          .then(function(response) {
            return response.data;
          });
      });
    }

    function unsetWorkaroundTime(ticketId) {
      if (!ticketId) {
        return $q.reject(new Error('ticketId is required'));
      }

      var notificationMessages = {
        progressing: 'Unsetting workaround time...',
        success: 'Workaround time is unset',
        failure: 'Failed to unset workaround time'
      };

      return asyncAction(notificationMessages, function() {
        return TicketingTicketClient.unsetWorkaroundTime(ticketId)
          .then(function(response) {
            return response.data;
          });
      });
    }

    function setCorrectionTime(ticketId) {
      if (!ticketId) {
        return $q.reject(new Error('ticketId is required'));
      }

      var notificationMessages = {
        progressing: 'Setting correction time...',
        success: 'Correction time is set',
        failure: 'Failed to set correction time'
      };

      return asyncAction(notificationMessages, function() {
        return TicketingTicketClient.setCorrectionTime(ticketId)
          .then(function(response) {
            return response.data;
          });
      });
    }

    function unsetCorrectionTime(ticketId) {
      if (!ticketId) {
        return $q.reject(new Error('ticketId is required'));
      }

      var notificationMessages = {
        progressing: 'Unsetting correction time...',
        success: 'Correction time is unset',
        failure: 'Failed to unset correction time'
      };

      return asyncAction(notificationMessages, function() {
        return TicketingTicketClient.unsetCorrectionTime(ticketId)
          .then(function(response) {
            return response.data;
          });
      });
    }

    function _buildResponsiblePerson(ticket) {
      ticket.responsiblePerson = ticket.supportTechnicians && ticket.supportTechnicians.length > 0 ? ticket.supportTechnicians[0] : ticket.supportManager;

      return ticket;
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
