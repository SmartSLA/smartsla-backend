'use strict';

const { TICKETING_USER_ROLES, DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUserRole = mongoose.model('TicketingUserRole');

  return {
    get,
    create,
    createMultiple,
    deleteById,
    list,
    listByCursor,
    getByUser,
    updateById,
    updateRoleById,
    userIsAdministrator,
    userIsAdministratorOrExpert
  };

  function get(roleId) {
    return TicketingUserRole.findById(roleId).exec();
  }

  /**
   * Check a user is the administrator
   * @param {String}   userId   - The user ID
   * @param {Promise}           - Resolve on success
   */
  function userIsAdministrator(userId) {
    return TicketingUserRole
      .findOne({ user: userId })
      .exec()
      .then(result => !!result && result.role === TICKETING_USER_ROLES.ADMINISTRATOR);
  }

  /**
   * Create a TicketingUserRole
   * @param {Object}   ticketingUserRole - The ticketingUserRole object
   * @param {Promise}                    - Resolve on success
   */
  function create(ticketingUserRole) {
    ticketingUserRole = ticketingUserRole instanceof TicketingUserRole ? ticketingUserRole : new TicketingUserRole(ticketingUserRole);

    return TicketingUserRole.create(ticketingUserRole);
  }

  /**
   * Create multiple roles ar once
   *
   * @param {Array} ticketUserRoles - Array of {user, role} where user is userId, role is a string
   */
  function createMultiple(ticketUserRoles) {
    return TicketingUserRole.insertMany(ticketUserRoles);
  }

  /**
   * List TicketingUserRole.
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {
    const query = TicketingUserRole
      .find()
      .populate('user')
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .sort('-timestamps.creation');

    const limit = options.limit || DEFAULT_LIST_OPTIONS.OFFSET;

    if (limit !== -1) {
      query.limit(limit);
    }

    return query.exec();
  }

  /**
   * Get TicketingUserRole by user.
   * @param  {String}  user    - ID of user object
   * @param  {Object}  options - The options object, may contain array of population parameters
   * @return {Promise}         - Resolve on success
   */
  function getByUser(user, options = {}) {
    if (options.populations) {
      return TicketingUserRole.findOne({ user: user }).populate(options.populations);
    }

    return TicketingUserRole.findOne({ user: user });
  }

  /**
   * Delete TicketingUserRole by ID.
   * @param  {String}  userRoleId - ID of user role
   * @return {Promise}            - Resolve on success
   */
  function deleteById(userRoleId) {
    return TicketingUserRole.remove({ _id: userRoleId }).exec();
  }

  /**
   * Update a ticketingUserRole by ID
   * @param {String}   ticketingUserRoleId - The ticketingUserRole ID
   * @param {Object}   modified            - The modified ticketingUserRole object
   * @param {Promise}                      - Resolve on success
   */
  function updateById(ticketingUserRoleId, modified) {
    return TicketingUserRole.update({ _id: ticketingUserRoleId }, { $set: modified }).exec();
  }

  /**
   * Update the role value for the given role ID
   * @param {String} _id  - The role Id
   * @param {String} role    - The new value to set
   */
  function updateRoleById(_id, role) {
    return TicketingUserRole.update({ _id }, { role }).exec();
  }

  /**
   * List users using cursor
   * @return {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return TicketingUserRole
      .find()
      .populate({ path: 'user' })
      .cursor();
  }

/**
 * Checks if a user is administrator or expert
 *
 * @param {String} userId
 * @param {Object} ticketingUser
 */

  function userIsAdministratorOrExpert(user, ticketingUser) {
    return Promise.all([
      userIsAdministrator(user && user._id),
      userIsExpert()
    ]).then(checks => (checks[0] || checks[1]));

    function userIsExpert() {
      const userRole = ticketingUser && ticketingUser.role;

      return Promise.resolve(userRole === TICKETING_USER_ROLES.EXPERT);
    }
  }

};
