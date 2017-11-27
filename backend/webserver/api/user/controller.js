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
    get,
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
    const user = req.body;

    // setup accounts field
    user.accounts = [{
      type: 'email',
      emails: [user.email],
      hosted: true
    }];
    // setup domains field
    user.domains = [{
      domain_id: req.domain._id
    }];

    const denormalizeCreatedUser = createdUser => {
      const denormalizedUser = coreUser.denormalize.denormalize(createdUser);

      denormalizedUser.entity = createdUser.entity;

      return denormalizedUser;
    };

    lib.user.create(user)
      .then(createdUser => res.status(201).json(denormalizeCreatedUser(createdUser)))
      .catch(err => send500Error('Failed to create Ticketing user', err, res));
  }

  /**
   * Get a user by ID.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    lib.user.getById(req.params.id)
      .then(user => {
        const denormalizedUser = coreUser.denormalize.denormalize(user);

        // entity info
        denormalizedUser.entity = user.entity;
        res.status(201).json(denormalizedUser);
      })
      .catch(err => send500Error('Failed to get user', err, res));
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
   * List users with entity info.
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

          // entity info
          denormalizedUser.entity = user.entity;

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
