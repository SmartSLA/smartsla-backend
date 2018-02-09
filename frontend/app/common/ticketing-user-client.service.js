(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingUserClient', ticketingUserClient);

  function ticketingUserClient(ticketingRestangular) {
    var API_CONTEXT = 'users';

    return {
      create: create,
      get: get,
      update: update,
      list: list,
      getRole: getRole
    };

    /**
     * Create a Ticketing user.
     * @param  {Object} user - The user object
     * @return {Promise}     - Resolve response with created user
     */
    function create(user) {
      return ticketingRestangular.all(API_CONTEXT).post(user);
    }

    /**
     * Update a Ticketing user.
     * @param  {String} userId     - The user ID
     * @param  {Object} updateData - The update object
     * @return {Promise}           - Resolve response
     */
    function update(userId, updateData) {
      return ticketingRestangular.one(API_CONTEXT, userId).customPUT(updateData);
    }

    /**
     * List Ticketing users.
     * @param  {Object} options - Query option, possible attributes are limit, offset, search and role
     * @return {Promise}        - Resolve response with list of Ticketing users
     */
    function list(options) {
      return ticketingRestangular.all(API_CONTEXT).getList(options);
    }

    /**
     * Get a Ticketing user by ID.
     * @param  {String} userId - The user ID
     * @return {Promise}       - Resolve response with found user
     */
    function get(userId) {
      return ticketingRestangular.one('users', userId).get();
    }

    /**
     * Get user's role
     * @return {Promise} - Resolve response with user's role
     */
    function getRole() {
      return ticketingRestangular.all('user').one('role').get();
    }
  }
})(angular);
