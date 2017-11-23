'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

  return {
    addSoftware,
    create,
    createOrder,
    get,
    list,
    listOrders,
    update,
    updatePermissions,
    updateOrder
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
    const populations = [
      {
        path: 'manager'
      },
      {
        path: 'defaultSupportManager'
      },
      {
        path: 'organization'
      }
    ];

    return lib.contract.getById(req.params.id, { populations })
      .then(contract => {
        contract = contract.toObject();
        if (contract.manager) {
          contract.manager = coreUser.denormalize.denormalize(contract.manager);
        }

        // get all entities of contract's organization
        // then build permissions list
        return lib.organization.list({ parent: contract.organization._id })
          .then(entities => {
            contract.permissions = _buildContractPermissions(contract, entities);

            return res.status(201).json(contract);
          });

      })
      .catch(err => send500Error('Failed to get contract', err, res));
  }

  /**
   * Build permissions list of contract.
   *
   * @param {Object} contract - Contract object
   * @param {Array}  entities - Entities of contract's organization
   * @return {Array}          - List of permission objects
   */
  function _buildContractPermissions(contract, entities) {
    if (contract.permissions === 1) {
      return entities.map(entity => {
        entity = entity.toObject();
        entity.selected = true;

        return entity;
      });
    }

    return entities.map(entity => {
      entity = entity.toObject();
      entity.selected = contract.permissions.indexOf(String(entity._id)) > -1;

      return entity;
    });
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
      offset: +req.query.offset,
      organization: req.query.organization
    };

    options.populations = [{ path: 'manager' }];

    if (!req.query.organization) {
      options.populations.push({ path: 'organization' });
    }

    return lib.contract.list(options)
      .then(contracts => {
        const denormalizeManager = manager => coreUser.denormalize.denormalize(manager);

        contracts = contracts.map(contract => {
          if (contract.manager) {
            contract.manager = denormalizeManager(contract.manager);
          }

          return contract;
        });
        res.header('X-ESN-Items-Count', contracts.length);
        res.status(200).json(contracts);
      })
      .catch(err => send500Error('Failed to list contract', err, res));
  }

  /**
   * Update a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.contract.updateById(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update contract', err, res));
  }

  /**
   * Update permissions for contract.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function updatePermissions(req, res) {
    const { permissions } = req.body;

    return lib.contract.updateById(req.params.id, { permissions })
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update permissions of contract', err, res));
  }

  /**
   * Add a new software for a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function addSoftware(req, res) {
    return lib.contract.addSoftware(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to add software', err, res));
  }

  /**
   * Create an order
   *
   * @param {Request} req
   * @param {Response} res
   */
  function createOrder(req, res) {
    const order = req.body;

    order.contract = req.params.id;

    return lib.order.create(order)
      .then(createdOrder => res.status(201).json(createdOrder))
      .catch(err => send500Error('Failed to create order', err, res));
  }

  /**
   * List orders of contract.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function listOrders(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset,
      contract: req.params.id
    };

    // populate manager object of order
    options.populations = [{ path: 'manager' }];

    return lib.order.list(options)
      .then(orders => {
        // denormalize manager object
        orders.forEach(order => {
          if (order.manager) {
            order.manager = coreUser.denormalize.denormalize(order.manager);
          }
        });

        res.header('X-ESN-Items-Count', orders.length);
        res.status(200).json(orders);
      })
      .catch(err => send500Error('Failed to list order', err, res));
  }

  /**
   * Update an order
   *
   * @param {Request} req
   * @param {Response} res
   */
  function updateOrder(req, res) {
    return lib.order.updateById(req.params.orderId, req.body)
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          return res.status(204).end();
        }

        return send404Error('Order not found', res);
      })
      .catch(err => send500Error('Failed to update order', err, res));
  }
};
