'use strict';

const Q = require('q');
const { TICKETING_USER_ROLES } = require('./constants');
const EVENTS = {
  userDeleted: 'users:user:delete'
};

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const coreUser = dependencies('coreUser');
  const pubsub = dependencies('pubsub').local;
  const User = mongoose.model('User');
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);

  return {
    create,
    updateById,
    list
  };

  function create(user) {
    const coreUserJson = {
      firstname: user.firstname,
      lastname: user.lastname,
      accounts: [{
        type: 'email',
        emails: [user.email]
      }],
      main_phone: user.main_phone
    };

    return Q.ninvoke(coreUser, 'recordUser', coreUserJson)
      .then(createdUser => {
        const userRole = {
          user: createdUser._id,
          role: TICKETING_USER_ROLES.USER
        };

        return ticketingUserRole.create(userRole)
          .then(() => createdUser)
          .catch(err =>
            // remove createdUser if failed to create user role
            _deleteById(createdUser._id)
              .then(() => Q.reject(err))
          );
      });
  }

  /**
   * Update user by ID.
   * @param  {String} userId       - ID of user
   * @param  {Object} modifiedUser - Modified information
   * @return {[type]}              [description]
   */
  function updateById(userId, modifiedUser) {
    return Q.ninvoke(coreUser, 'updateProfile', userId, modifiedUser);
  }

  /**
   * List Ticketing users.
   * @param {Object}   options - The options object, may contain offset and limit
   * @param {Promise}          - Resolve on success
   */
  function list(options) {
    options = options || {};

    return ticketingUserRole.list(options)
      .then(userRoles => userRoles.map(userRole => userRole.user));
  }

  function _deleteById(userId) {
    return User.findByIdAndRemove(userId).exec()
      .then(removedUser => {
        if (removedUser) {
          // remove data from ElasticSearch index
          pubsub.topic(EVENTS.userDeleted).publish(removedUser);
        }

        return removedUser;
      });
  }
};
