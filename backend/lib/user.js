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
  const organization = require('./organization')(dependencies);

  return {
    create,
    getById,
    updateById,
    list
  };

  /**
   * Create new user and corresponding user role.
   * Also add new user into entity if need.
   * @param  {Object} user - New user info
   * @return {Promise}     - Resolve with created user on success
   */
  function create(user) {
    return Q.ninvoke(coreUser, 'recordUser', user)
      .then(createdUser => {
        const userRole = {
          user: createdUser._id,
          role: TICKETING_USER_ROLES.USER
        };

        return ticketingUserRole.create(userRole)
          .then(createdUserRole => {
            // add user into entity
            if (user.entity) {
              return organization.addUsersById(user.entity._id, [createdUser._id])
                .then(() => {
                  createdUser = createdUser.toObject();

                  return organization.getById(user.entity.parent)
                    .then(organization => {
                      user.entity.parent = organization;
                      createdUser.entity = user.entity;
                    });
                })
                .then(() => createdUser)
                .catch(err =>
                  // remove createdUserRole if failed to add user into entity
                  ticketingUserRole.deleteById(createdUserRole._id)
                    .then(() => Q.reject(err))
                );
            }

            return createdUser;
          })
          .catch(err =>
            // remove createdUser if failed to create user role
            _deleteById(createdUser._id)
              .then(() => Q.reject(err))
          );
      });
  }

  function getById(userId) {
    const options = {
      populations: [{ path: 'user' }]
    };

    return ticketingUserRole.getByUser(userId, options)
      .then(userRole => _buildUserFromUserRole(userRole));
  }

  /**
   * Update user by ID.
   * @param  {String} userId       - ID of user
   * @param  {Object} modifiedUser - Modified information
   * @return {Promise}             - Resolve on success
   */
  function updateById(userId, modifiedUser) {
    return Q.ninvoke(coreUser, 'updateProfile', userId, modifiedUser);
  }

  /**
   * List Ticketing users with entity info.
   * @param {Object}   options - The options object, may contain offset and limit
   * @param {Promise}          - Resolve on success
   */
  function list(options) {
    options = options || {};

    return ticketingUserRole.list(options)
      .then(userRoles => {
        const usersPromises = userRoles.map(userRole => _buildUserFromUserRole(userRole));

        return Q.all(usersPromises);
      });
  }

  function _buildUserFromUserRole(userRole) {
    return organization.getEntityByUserId(userRole.user._id)
      .then(entity => {
        if (entity) {
          userRole.user.entity = entity;
        }

        return userRole.user;
      });
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
