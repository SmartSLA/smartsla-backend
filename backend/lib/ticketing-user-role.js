'use strict';

const { TICKETING_USER_ROLES, DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUserRole = mongoose.model('TicketingUserRole');

  return {
    create,
    list,
    userIsAdministrator,
    getByUser
  };

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
   * List TicketingUserRole.
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    return TicketingUserRole
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .populate('user')
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * Get TicketingUserRole by user.
   * @param  {String} user - ID of user object
   * @return {Promise}     - Resolve on success
   */
  function getByUser(user) {
    return TicketingUserRole.findOne({ user: user });
  }
};
