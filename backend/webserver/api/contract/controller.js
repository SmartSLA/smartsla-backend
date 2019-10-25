'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');
  const logger = dependencies('logger');

  return {
    create,
    get,
    list,
    update,
    remove,
    addUsers,
    getUsers
  };

  /**
   * Create a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.contract.create(req.body)
      .then(createdContract => res.status(201).json(createdContract))
      .catch(err => send500Error('Failed to create contract', err, res));
  }

  /**
   * Get a contract by ID.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.contract.getById(req.params.id)
      .then(contract => {
        contract = contract.toObject();

        return res.status(200).json(contract);

      })
      .catch(err => send500Error('Failed to get contract', err, res));
  }

  /**
   * List the contracts
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    lib.ticketingUserRole.userIsAdministrator(req.user._id)
      .then(isAdmin => (isAdmin || (req.ticketingUser && req.ticketingUser.type === 'expert')))
      .then(canViewAll => (canViewAll ? _listAll() : _listUserContracts(req.user._id)))
      .then(({ size, list }) => {
        res.header('X-ESN-Items-Count', size);
        res.status(200).json(list);
      })
      .catch(err => send500Error('Error while getting contracts', err, res));

    function _listAll() {
      return lib.contract.list(options).then(contracts => ({
        size: contracts.length,
        list: contracts
      }));
    }

    function _listUserContracts(userId) {
      return lib.contract.listForUser(userId, ['contract'])
        .then(userContracts => {
          if (!userContracts || !userContracts.length) {
            logger.info('No contracts for user', req.user._id);
          }

          return {
            size: userContracts.length,
            list: userContracts.map(userContract => userContract.contract)
          };
        });
    }
  }

  /**
   * Update a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.contract.updateById(req.params.id, req.body)
      .then(modified => {
        if (modified) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update contract', err, res));
  }

  /**
   * Delete a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function remove(req, res) {
    return lib.contract.removeById(req.params.id)
      .then(deletedContract => {
        if (deletedContract) {
          return res.status(204).end();
        }

        return send404Error('contract not found', res);
      })
      .catch(err => send500Error('Failed to delete contract', err, res));
  }

  function addUsers(req, res) {
    if (!req.body) {
      return res.status(400);
    }

    return lib.contract.addUsers(req.params.id, req.body)
      .then(() => res.status(200).send())
      .catch(err => send500Error('Failed to update contract', err, res));
  }

  function getUsers(req, res) {
    return Promise.all([
      lib.ticketingUser.listByType('expert'),
      _getCustomers(req.params.id)
    ])
    .then(([experts, customers]) => {
      const expertsResult = experts.map(expert => ({
        user: { ...coreUser.denormalize.denormalize(expert.user), ...{ displayName: expert.name } },
        type: expert.type,
        role: expert.role
      }));
      const customersResult = customers.map(customerType => ({
        user: { ...coreUser.denormalize.denormalize(customerType.customer.user), ...{ displayName: customerType.displayName } },
        role: customerType.customer.role,
        type: customerType.type
      }));

      res.status(200).json([...expertsResult, ...customersResult]);
    })
    .catch(err => send500Error('Failed to get user for contracts', err, res));

    function _getCustomers(contractId) {
      return lib.contract.getUsers(contractId, ['user'])
        .then(users => getCustomersTypes(users));
    }

    function getCustomersTypes(customers = []) {
      const ids = customers
        .filter(customer => !!customer.user)
        .map(customer => customer.user._id);

      return lib.ticketingUser.listByUserIds(ids)
        .then(ticketingUsers => customers.map(customer => ({
          type: findType(customer, ticketingUsers),
          customer,
          displayName: findDisplayName(customer, ticketingUsers)
        })));
    }

    function findDisplayName(customer, ticketingUsers) {
      if (!customer.user) {
        return;
      }

      const ticketingUser = ticketingUsers.find(ticketingUser => ticketingUser.user.equals(customer.user._id));

      return ticketingUser && ticketingUser.name;
    }

    function findType(customer, ticketingUsers) {
      // TODO: Default type from role
      const defaultType = 'beneficiary';

      if (!customer.user) {
        return defaultType;
      }

      const ticketingUser = ticketingUsers.find(ticketingUser => ticketingUser.user.equals(customer.user._id));

      return ticketingUser !== -1 ? ticketingUser.type : defaultType;
    }
  }
};
