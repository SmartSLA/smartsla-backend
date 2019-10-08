'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

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
    let getContracts;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search
      };

      errorMessage = 'Error while searching contracts';
      getContracts = lib.contract.search(options);
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        organization: req.query.organization
      };

      errorMessage = 'Failed to list contracts';
      getContracts = lib.contract.list(options)
        .then(contracts => {
          const denormalizeManager = manager => coreUser.denormalize.denormalize(manager);

          contracts = contracts.map(contract => {
            if (contract.manager) {
              contract.manager = denormalizeManager(contract.manager);
            }

            return contract;
          });

          return {
            total_count: contracts.length,
            list: contracts
          };
        });
    }

    return getContracts
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
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
