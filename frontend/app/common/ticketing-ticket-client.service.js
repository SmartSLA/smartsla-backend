(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketClient', TicketingTicketClient);

  function TicketingTicketClient(ticketingRestangular) {
    return {
      create: create,
      list: list
    };

    /**
     * Create a new ticket.
     * @param  {Object} ticket - The ticket object
     * @return {Promise}       - Resolve response with created ticket
     */
    function create(ticket) {
      return ticketingRestangular.all('tickets').post(ticket);
    }

    /**
     * List tickets.
     * @param  {Object} options - Query option, possible attributes are state, limit, offset
     * @return {Promise}        - Resolve response with list of tickets
     */
    function list(options) {
      return ticketingRestangular.all('tickets').getList(options);
    }
  }
})(angular);
