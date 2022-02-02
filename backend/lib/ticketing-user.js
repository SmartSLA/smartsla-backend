'use strict';

const { DEFAULT_LIST_OPTIONS, TICKETING_CONTRACT_ROLES } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUser = mongoose.model('TicketingUser');

  return {
    create,
    list,
    getByUser,
    listByType,
    listByUserIds,
    removeById,
    updateUserById,
    listByClientId
  };

  /**
   * Create a TicketingUser
   * @param {Object}   ticketingUserRole - The ticketingUserRole object
   * @param {Promise}                    - Resolve on success
   */
  function create(ticketingUser) {
    ticketingUser = ticketingUser instanceof TicketingUser ? ticketingUser : new TicketingUser(ticketingUser);

    return TicketingUser.create(ticketingUser);
  }

  /**
   * List TicketingUser
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {
    return TicketingUser
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  function listByType(type) {
    return TicketingUser.find({ type }).exec();
  }

  function listByUserIds(userIds) {
    return TicketingUser.find({ user: { $in: userIds }}).exec();
  }

  /**
   * Get TicketingUser by user ID
   * @param  {String}  userId  - ID of user object
   * @return {Promise}         - Resolve on success
   */
  function getByUser(userId) {
    return TicketingUser
      .findOne({ user: userId });
  }

  /**
   * Remove user by ID
   */
  function removeById(userId) {
    return TicketingUser.remove({ user: userId }).exec();
  }

  /**
   * Update TicketingUser by Id
   * @param {String}   userId  - The user identifier
   * @param {Object}   user    - The user object
   */
  function updateUserById(userId, user) {
    return TicketingUser
      .findByIdAndUpdate(
        userId,
        { $set: user },
        { new: true }
      )
      .exec();
  }

  function listByClientId(clientId) {
    return TicketingUser.find({
        client: { $in: clientId },
        role: TICKETING_CONTRACT_ROLES.CONTRACT_MANAGER
    }).exec();
  }
};
