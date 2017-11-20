(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingSoftwareClient', ticketingSoftwareClient);

  function ticketingSoftwareClient(ticketingRestangular) {
    return {
      create: create,
      list: list,
      update: update
    };

    /**
     * List software
     * @param  {Object} options - Query option, possible attributes are limit and offset
     * @return {Promise}        - Resolve response with list of softwares
     */
    function list(options) {
      return ticketingRestangular.all('software').getList(options);
    }

    /**
     * Create a new software
     * @param  {Object} software - The software object
     * @return {Promise}         - Resolve response with created software
     */
    function create(software) {
      return ticketingRestangular.all('software').post(software);
    }

    /**
     * Update a software
     * @param  {String} softwareId  - The software ID
     * @param  {Object} updateData  - The update object
     * @return {Promise}            - Resolve response with updated software
     */
    function update(softwareId, updateData) {
      return ticketingRestangular.one('software', softwareId).customPUT(updateData);
    }
  }
})(angular);
