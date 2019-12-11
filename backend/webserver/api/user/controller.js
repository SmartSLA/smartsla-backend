'use strict';

module.exports = (dependencies, lib) => {
  const coreUser = dependencies('coreUser');
  const domainModule = dependencies('coreDomain');
  const coreUserDenormalizer = dependencies('coreUserDenormalizer');

  const {
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    create,
    get,
    getCurrentUser,
    getRole,
    update,
    list,
    remove
  };

  /**
   * Create Ticketing user.
   * @param  {Object} req
   * @param  {Object} res
   */
  function create(req, res) {
    const user = req.body;

    user.accounts = [{
      type: 'email',
      emails: [user.email],
      hosted: true
    }];
    user.domains = [{
      domain_id: req.domain._id
    }];

    lib.user.create(user)
      .then(createdUser => addUserToContracts(createdUser, req.body.contracts || []))
      .then(createdUser => res.status(201).json(denormalize(createdUser)))
      .catch(err => send500Error('Failed to create Ticketing user', err, res));

    function addUserToContracts(user, contracts) {
      if (!contracts || !contracts.length) {
        return Promise.resolve(user);
      }

      return Promise.all(contracts.map(({contract_id, role}) => lib.contract.addUsers(contract_id, [{ user: user._id, role }])))
        .then(() => user);
    }

    function denormalize(user) {
      const denormalizedUser = coreUser.denormalize.denormalize(user);

      denormalizedUser.entity = user.entity;

      return denormalizedUser;
    }
  }

  /**
   * Get a user by ID.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    Promise.all([
      lib.user.getById(req.params.id),
      lib.contract.listForUser(
        req.params.id,
        {
          path: 'contract',
          select: 'name _id client clientId'
        }
      )
    ]).then(([user, contracts]) => {
      user = user.toObject();
      res.status(200).json({
        ...user,
        contracts: contracts || []
      });
    })
    .catch(err => send500Error('Failed to get user', err, res));
  }

  function getCurrentUser(req, res) {
    Promise.all([
      coreUserDenormalizer.denormalize(req.user, { includeIsPlatformAdmin: true }),
      lib.user.getById(req.user._id),
      lib.contract.listForUser(req.user._id, {
        path: 'contract',
        select: 'name'
      }),
      lib.ticketingUserRole.userIsAdministrator(req.user._id),
      isDomainAdmin(req.user, req.domain)
    ]).then(([user, ticketingUser, contracts, isApplicationAdmin, isDomainAdmin]) => {
      res.status(200).json({
        ...user,
        ...{ roles: { isApplicationAdmin, isPlatformAdmin: user.isPlatformAdmin, isDomainAdmin }, ticketing: ticketingUser, contracts: contracts || [] }
      });
    })
    .catch(err => send500Error('Failed to get user', err, res));

    function isDomainAdmin(user, domain) {
      return new Promise(resolve => {
        domainModule.userIsDomainAdministrator(user, domain, (err, isDomainAdministrator) => {
          resolve(!err && isDomainAdministrator);
        });
      });
    }
  }

  /**
   * Update a user. Only allow update main phone and description now.
   * @param  {Object} req
   * @param  {Object} res
   */
  function update(req, res) {
    const {contracts, ...user} = req.body;

    lib.user.updateById(req.params.id, user)
      .then(updatedUser => {
        if (!updatedUser) {
          return send404Error('User not found', res);
        }

        lib.contract.updateUser(user, contracts).then(() => res.status(204).end());
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
    let getUsers;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        role: req.query.role
      };

      errorMessage = 'Error while searching users';
      getUsers = lib.user.search(options);
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset
      };

      options.populations = [{ path: 'manager' }];

      if (req.query.type) {
        options.type = req.query.type;
      }

      if (!req.query.organization) {
        options.populations.push({ path: 'organization' });
      }

      errorMessage = 'Failed to list users';
      getUsers = lib.user.list(options)
        .then(users => {
          const denormalizedUsers = users.map(user => {
            const denormalizedUser = coreUser.denormalize.denormalize(user);

            // entity info
            denormalizedUser.entity = user.entity;

            return user;
          });

          return {
            total_count: denormalizedUsers.length,
            list: denormalizedUsers
          };
        });
    }

    return getUsers
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Get user role
   *
   * @param {Request} req
   * @param {Response} res
   */
  function getRole(req, res) {
    return lib.ticketingUserRole.getByUser(req.user._id)
      .then(result => {
        if (!result) {
          return send404Error('User not found', res);
        }

        return res.status(200).json(result.role);
      })
      .catch(err => send500Error('Unable to get role', err, res));
  }

  /**
   * Delete a user
   *
   * @param {Request} req
   * @param {Response} res
   */
  function remove(req, res) {
    return lib.ticketingUser.removeById(req.params.id)
    .then(deletedUser => {
      if (deletedUser) {
        return res.status(204).end();
      }

      return send404Error('user not found', res);
    })
    .catch(err => send500Error('Failed to delete the user', err, res));
  }
};
