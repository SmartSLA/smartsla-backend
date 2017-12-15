(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketClient', TicketingTicketClient);

  function TicketingTicketClient(ticketingRestangular) {
    return {
      create: create
    };

    /**
     * Create a new ticket.
     * @param  {Object} ticket - The ticket object
     * @return {Promise}       - Resolve response with created ticket
     */
    function create(ticket) {
      return ticketingRestangular.all('tickets').post(ticket);
    }
  }
})(angular);
