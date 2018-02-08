(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketClient', TicketingTicketClient);

  function TicketingTicketClient(ticketingRestangular) {
    return {
      create: create,
      list: list,
      get: get,
      getActivities: getActivities,
      update: update,
      updateState: updateState,
      setWorkaroundTime: setWorkaroundTime,
      unsetWorkaroundTime: unsetWorkaroundTime,
      setCorrectionTime: setCorrectionTime,
      unsetCorrectionTime: unsetCorrectionTime
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
     * @param  {Object} options - Query option, possible attributes are scope, state, limit and offset
     * @return {Promise}        - Resolve response with list of tickets
     */
    function list(options) {
      return ticketingRestangular.all('tickets').getList(options);
    }

    /**
     * Get a ticket by ID.
     * @param  {String} ticketId - The ticket ID
     * @return {Promise}         - Resolve response with a ticket
     */
    function get(ticketId) {
      return ticketingRestangular.one('tickets', ticketId).get();
    }

    /**
     * Update basic info of ticket.
     * @param  {String} ticketId    - The ticket ID
     * @param  {Object} updateData  - The update object
     * @return {Promise}            - Resolve on success
     */
    function update(ticketId, updateData) {
      return ticketingRestangular.one('tickets', ticketId).customPOST(updateData);
    }

    /**
     * Update state of ticket.
     * @param  {String} ticketId  - The ticket ID
     * @param  {String} newState  - New state
     * @return {Promise}          - Resolve on success
     */
    function updateState(ticketId, newState) {
      return ticketingRestangular.one('tickets', ticketId).customPOST({ state: newState }, null, { action: 'updateState' });
    }

    /**
     * Set workaround time of ticket.
     * @param  {String} ticketId  - The ticket ID
     * @return {Promise}          - Resolve on success
     */
    function setWorkaroundTime(ticketId) {
      return ticketingRestangular.one('tickets', ticketId).customPOST({}, null, { action: 'set', field: 'workaround' });
    }

    /**
     * Unset workaround time of ticket.
     * @param  {String} ticketId  - The ticket ID
     * @return {Promise}          - Resolve on success
     */
    function unsetWorkaroundTime(ticketId) {
      return ticketingRestangular.one('tickets', ticketId).customPOST({}, null, { action: 'unset', field: 'workaround' });
    }

    /**
     * Set correction time of ticket.
     * @param  {String} ticketId  - The ticket ID
     * @return {Promise}          - Resolve on success
     */
    function setCorrectionTime(ticketId) {
      return ticketingRestangular.one('tickets', ticketId).customPOST({}, null, { action: 'set', field: 'correction' });
    }

    /**
     * Unset correction time of ticket.
     * @param  {String} ticketId  - The ticket ID
     * @return {Promise}          - Resolve on success
     */
    function unsetCorrectionTime(ticketId) {
      return ticketingRestangular.one('tickets', ticketId).customPOST({}, null, { action: 'unset', field: 'correction' });
    }

    /**
     * List ticket's activities
     * @param  {String} ticketId  - The ticket ID
     * @param  {Object} options   - Query option, possible attributes are limit and offset
     * @return {Promise}          - Resolve on success
     */
    function getActivities(ticketId, options) {
      return ticketingRestangular
        .one('tickets', ticketId)
        .all('activities')
        .getList(options);
    }
  }
})(angular);
