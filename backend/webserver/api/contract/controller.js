'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

  return {
    create,
    createOrder,
    get,
    list,
    listOrders,
    update,
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
   * Get a contract by Id
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.contract.getById(req.params.id)
      .then(contract => {
        contract = contract.toObject();
        if (contract.manager) {
          contract.manager = coreUser.denormalize.denormalize(contract.manager);
        }

        return res.status(201).json(contract);
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
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update contract', err, res));
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
   * List the orders
   *
   * @param {Request} req
   * @param {Response} res
   */
  function listOrders(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    return lib.order.list(options)
      .then(orders => {
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
