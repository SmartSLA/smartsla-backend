(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingOrganizationClient', ticketingOrganizationClient);

  function ticketingOrganizationClient(ticketingRestangular) {
    return {
      create: create,
      list: list,
      update: update
    };

    /**
     * List organization
     * @param  {Object} options - Query option, possible attributes are limit and offset
     * @return {Promise}        - Resolve response with list of organizations
     */
    function list(options) {
      return ticketingRestangular.all('organizations').getList(options);
    }

    /**
     * Create a new organization
     * @param  {Object} organization - The organization object
     * @return {Promise}             - Resolve response with created organization
     */
    function create(organization) {
      return ticketingRestangular.all('organizations').post(organization);
    }

    /**
     * Update a organization
     * @param  {String} organizationId  - The organization ID
     * @param  {Object} updateData      - The update object
     * @return {Promise}                - Resolve response with updated organization
     */
    function update(organizationId, updateData) {
      return ticketingRestangular.one('organizations', organizationId).customPUT(updateData);
    }
  }
})(angular);
