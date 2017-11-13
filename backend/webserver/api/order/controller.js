'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const { denormalize } = dependencies('coreUser');

  return {
    get
  };

  /**
   * Get an order.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    const populations = [
      {
        path: 'contract',
        populate: {
          path: 'organization'
        }
      },
      {
        path: 'manager'
      },
      {
        path: 'defaultSupportManager'
      },
      {
        path: 'defaultSupportTechnician'
      }
    ];

    return lib.order.getById(req.params.id, { populations })
      .then(order => {
        if (!order) {
          return send404Error('Order not found', res);
        }

        order = order.toObject();
        if (order.manager) {
          order.manager = denormalize.denormalize(order.manager);
        }
        if (order.defaultSupportManager) {
          order.defaultSupportManager = denormalize.denormalize(order.defaultSupportManager);
        }
        if (order.defaultSupportTechnician) {
          order.defaultSupportTechnician = denormalize.denormalize(order.defaultSupportTechnician);
        }

        return res.status(200).json(order);
      })
      .catch(err => send500Error('Failed to get order', err, res));
  }
};
