'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const logger = dependencies('logger');
  const { REQUEST_TYPE, USER_TYPE, TICKETING_CONTRACT_ROLES } = require('../../../lib/constants');

  return {
    create,
    get,
    list,
    update,
    remove,
    addUsers,
    getUsers,
    getTicketsByContract
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
   * Get a contract tickets
   *
   * @param {Request} req
   * @param {Response} res
   */
  function getTicketsByContract(req, res) {
    const options = {};
    const userType = req.ticketingUser && req.ticketingUser.type;

    if (userType) {
      options.userType = userType;
    }

    lib.contract
      .getById(req.params.id)
      .then(contract => {
        contract = contract.toObject();

        lib.ticket.listForContracts(contract, options).then(({list}) => {
          const ticketsWithoutAdministrationType = list.filter(
            request =>
              request.type && request.type !== REQUEST_TYPE.ADMINISTRATION
          );

          res.status(200).send({
            size: ticketsWithoutAdministrationType.length,
            list: ticketsWithoutAdministrationType
          });
        });
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
      const ticketingUser = req.ticketingUser;

      if (ticketingUser && ticketingUser.role === TICKETING_CONTRACT_ROLES.CONTRACT_MANAGER) {
        return _listContractsByClient(ticketingUser.client);
      }

      return lib.contract.listForUser(userId, {
          path: 'contract',
          populate: { path: 'software.software' }
        })
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

    function _listContractsByClient(client) {
      return lib.contract.listByClient(client).then(contracts => ({
        size: contracts.length,
        list: contracts
      }));
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
      _getCustomers(req.params.id),
      _getContractManagers(req.params.id)
    ])
    .then(([experts, customers, contractManagers]) => {
      res.header('X-ESN-Items-Count', experts.length + customers.length + contractManagers.length);
      res.status(200).json([...experts, ...customers, ...contractManagers]);
    })
    .catch(err => send500Error('Failed to get user for contracts', err, res));

    function _getCustomers(contractId) {
      return lib.contract.getUsers(contractId)
        .then(users => {
          const userIds = users.map(customer => customer.user);

          return lib.ticketingUser.listByUserIds(userIds);
        })
        .then(ticketingUsers => {
          const customerTicketingUsers = ticketingUsers.filter(({ type }) => type === USER_TYPE.BENEFICIARY);

          return customerTicketingUsers;
        });
    }

    function _getContractManagers(contractId) {
      return lib.contract.getById(contractId)
        .then(contract => {
          contract = contract.toObject();

          return lib.ticketingUser.listByClientId(contract.clientId).then(users => users);
        });
    }
  }
};
