'use strict';

module.exports = (dependencies, lib) => {
  const coreUser = dependencies('coreUser');
  const {
    send403Error,
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    create,
    update,
    list,
    userIsAdministrator
  };

  /**
   * Create Ticketing user.
   * @param  {Object} req
   * @param  {Object} res
   */
  function create(req, res) {
    lib.user.create(req.body)
      .then(createdUser => res.status(201).json(coreUser.denormalize.denormalize(createdUser)))
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
   * List users with organization info.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    return lib.user.list(options)
      .then(users => {
        const denormalizedUsers = users.map(user => {
          const denormalizedUser = coreUser.denormalize.denormalize(user);

          // organization info
          denormalizedUser.organization = user.organization;

          return denormalizedUser;
        });

        res.header('X-ESN-Items-Count', denormalizedUsers.length);
        res.status(200).json(denormalizedUsers);
      })
      .catch(err => send500Error('Failed to list users', err, res));
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
