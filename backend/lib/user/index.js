'use strict';

const Q = require('q');
const { TICKETING_USER_ROLES, EVENTS } = require('../constants');

module.exports = dependencies => {
  const userModule = dependencies('coreUser');
  const logger = dependencies('logger');
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsub = dependencies('pubsub').local;

  const User = mongoose.model('User');
  const ticketingUser = require('../ticketing-user')(dependencies);
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
    logger.debug('Creating user', user);
    const userAsModel = user instanceof User ? user : new User(user);
    const role = user.role || TICKETING_USER_ROLES.USER;

    return new Promise((resolve, reject) => {
      userModule.findByEmail(user.email, (err, opUser) => {
        if (err) {
          return reject('Problem while searching user by email');
        }

        if (!opUser) {
          logger.info('User is not an openpaas user, creating it', user);

          return userModule.recordUser(userAsModel, (err, result) => {
            if (err) {
              return reject('Problem while recording openpaas user');
            }

            if (!result) {
              return reject('Can not record user');
            }

            _provisionTicketingUser(result, user, true);
          });
        }

        _provisionTicketingUser(opUser, user);
      });

      function _provisionTicketingUser(opUser, user, isNewUser) {
        logger.info('Creating the ticketing user for OP user', opUser._id);

        const newTicketingUser = {
          user: opUser._id,
          role,
          type: user.type || '',
          email: user.email || '',
          name: user.name || '',
          phone: user.phone || '',
          jobTitle: opUser.job_title || user.jobTitle || ''
        };

        ticketingUser.create(newTicketingUser)
          .then(createdUser => createdUser.toObject())
          .then(createdUserObject => {
            createdUserObject.role = role;
            userCreatedTopic.publish(createdUserObject);

            resolve(opUser);
          })
          .catch(err => {
            if (!isNewUser) {
              return reject(err);
            }

            _deleteById(opUser._id).then(() => reject(err));
        });
      }
    });
  }

  function getById(userId) {
    return ticketingUser.getByUser(userId);
  }

  /**
   * Update user by ID.
   * @param  {String} userId   - ID of user
   * @param  {Object} modified - Modified information
   * @return {Promise}         - Resolve on success
   */
  function updateById(userId, modified = {}) {
    return ticketingUser.updateUserById(userId, modified)
      .then(modified => {
        if (modified) {
          userUpdatedTopic.publish(modified);
        }

        return modified;
      });
  }

  /**
   * List Ticketing users with entity info.
   * @param {Object}   options - The options object, may contain offset and limit
   * @param {Promise}          - Resolve on success
   */
  function list(options) {
    options = options || {};

    return options.type ? ticketingUser.listByType(options.type).then(users => Q.all(users)) : ticketingUser.list(options).then(users => Q.all(users));
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
