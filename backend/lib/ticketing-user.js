'use strict';

const { DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUser = mongoose.model('TicketingUser');

  return {
    create,
    list
  };

  /**
   * Create a TicketingUserRole
   * @param {Object}   ticketingUserRole - The ticketingUserRole object
   * @param {Promise}                    - Resolve on success
   */
  function create(ticketingUser) {
    ticketingUser = ticketingUser instanceof TicketingUser ? ticketingUser : new TicketingUser(ticketingUser);

    return TicketingUser.create(ticketingUser);
  }

  /**
   * List TicketingUserRole.
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {
    return TicketingUser
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .populate('user')
      .sort('-timestamps.creation')
      .exec();
  }
};
