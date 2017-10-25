'use strict';

module.exports = (dependencies, lib) => {
  const {
    send403Error,
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    create,
    update,
    userIsAdministrator
  };

  /**
   * Create Ticketing user.
   * @param  {Object} req
   * @param  {Object} res
   */
  function create(req, res) {
    lib.user.create(req.body)
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

    lib.user.updateById(req.params.id, modifiedUser)
      .then(updatedResult => {
        if (!updatedResult) {
          return send404Error('User not found', res);
        }

        res.status(204).end();
      })
      .catch(err => send500Error('Failed to update Ticketing user', err, res));
    }

  /**
   * Check a user is administrator
   *
   * @param {Request} req
   * @param {Response} res
   */
  function userIsAdministrator(req, res) {
    return lib.ticketingUserRole.getByUser(req.params.id)
      .then(result => {
        if (!result) {
          return send403Error('User does not have permission to access Ticketing', res);
        }

        return res.status(200).json(result.role === lib.constants.TICKETING_USER_ROLES.ADMINISTRATOR);
      })
      .catch(err => send500Error('Failed to get role', err, res));
    }
};
