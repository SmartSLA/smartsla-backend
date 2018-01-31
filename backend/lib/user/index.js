'use strict';

const Q = require('q');
const { TICKETING_USER_ROLES, EVENTS } = require('../constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsub = dependencies('pubsub').local;

  const User = mongoose.model('User');
  const ticketingUserRole = require('../ticketing-user-role')(dependencies);
  const organization = require('../organization')(dependencies);
  const search = require('./search')(dependencies);
  const userCreatedTopic = pubsub.topic(EVENTS.USER.created);
  const userUpdatedTopic = pubsub.topic(EVENTS.USER.updated);
  const userDeletedTopic = pubsub.topic(EVENTS.USER.deleted);

  return {
    create,
    getById,
    updateById,
    list,
    search
  };

  /**
   * Create new user and corresponding user role.
   * Also add new user into entity if need.
   * @param  {Object} user - New user info
   * @return {Promise}     - Resolve with created user on success
   */
  function create(user) {
    const userAsModel = user instanceof User ? user : new User(user);
    const role = user.role || TICKETING_USER_ROLES.USER;

    return User.create(userAsModel)
      .then(createdUser => {
        const userRole = {
          user: createdUser._id,
          role
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

            return createdUser.toObject();
          })
          .then(createdUserObject => {
            createdUserObject.role = role;
            userCreatedTopic.publish(createdUserObject);

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
   * @param  {String} userId   - ID of user
   * @param  {Object} modified - Modified information
   * @return {Promise}         - Resolve on success
   */
  function updateById(userId, modified = {}) {
    // Don't try to use findOneAndUpdate or findByIdAndUpdate functions because they will trigger
    // the patched function in core: findOneAndUpdate
    // https://ci.linagora.com/linagora/lgs/openpaas/esn/blob/master/backend/core/db/mongo/plugins/helpers.js#L31
    return User.findById(userId)
      .exec()
      .then(user => {
        if (!user) {
          return;
        }

        user = Object.assign(user, modified);

        return user.save()
          .then(updatedUser => {
            userUpdatedTopic.publish(updatedUser);

            return updatedUser;
          });
      });
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
    if (!userRole) {
      return null;
    }

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
          userDeletedTopic.publish(removedUser);
        }

        return removedUser;
      });
  }
};
