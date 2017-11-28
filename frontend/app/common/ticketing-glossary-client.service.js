(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingGlossaryClient', TicketingGlossaryClient);

  function TicketingGlossaryClient(ticketingRestangular) {
    return {
      create: create,
      list: list
    };

    /**
     * List glossaries.
     * @param  {Object} options - Query option, possible attribute is category
     * @return {Promise}        - Resolve response with list of glossaries
     */
    function list(options) {
      return ticketingRestangular.all('glossaries').getList(options);
    }

    /**
     * Create a new glossary.
     * @param  {Object} glossary - The glossary object
     * @return {Promise}         - Resolve response with created glossary
     */
    function create(glossary) {
      return ticketingRestangular.all('glossaries').post(glossary);
    }
  }
})(angular);
