(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingUserClient', ticketingUserClient);

  function ticketingUserClient(ticketingRestangular) {
    var API_CONTEXT = 'users';

    return {
      create: create,
      update: update
    };

    /**
     * Create a Ticketing user
     * @param  {Object} user - The user object
     * @return {Promise}     - Resolve response with created user
     */
    function create(user) {
      return ticketingRestangular.all(API_CONTEXT).post(user);
    }

    /**
     * Update a Ticketing user
     * @param  {String} userId     - The user ID
     * @param  {Object} updateData - The update object
     * @return {Promise}           - Resolve response
     */
    function update(userId, updateData) {
      return ticketingRestangular.one(API_CONTEXT, userId).customPUT(updateData);
    }
  }
})(angular);
