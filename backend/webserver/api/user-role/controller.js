'use strict';

const Q = require('q');
const { TICKETING_USER_ROLES } = require('../../../lib/constants');

module.exports = (dependencies, lib) => {
  const coreUser = dependencies('user');
  const {
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    create,
    update
  };

  function create(req, res) {
    _createTicketingUser(req.body)
      .then(createdUser => res.status(201).json(createdUser))
      .catch(err => send500Error('Failed to create Ticketing user', err, res));
  }

  /**
   * Update a user. Only allow update main phone and description now.
   * @param  {Object} req
   * @param  {Object} res
   */
  function update(req, res) {
    const modifiedUser = {
      main_phone: req.body.main_phone,
      description: req.body.description
    };

    coreUser.updateProfile(req.params.id, modifiedUser, (err, updatedResult) => {
      if (err) {
        return send500Error('Failed to update Ticketing user', err, res);
      }

      if (!updatedResult) {
        return send404Error('User not found', res);
      }

      return res.status(204).end();
    });
  }

  function _createTicketingUser(user) {
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

        return lib.ticketingUserRole.create(userRole)
          .then(() => createdUser)
          .catch(err =>
            // remove createdUser if failed to create user role
            Q.ninvoke(lib.coreUser, 'deleteById', createdUser._id)
              .then(() => Q.reject(err))
          );
      });
  }
};
