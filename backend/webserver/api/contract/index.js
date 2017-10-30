'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateContract,
    canListContract,
    canUpdateContract,
    canCreateOrder,
    canListOrder,
    canUpdateOrder,
    validateContractPayload,
    validateContractUpdate,
    validateOrderPayload
  } = require('./middleware')(dependencies, lib);

  router.get('/contracts',
    authorizationMW.requiresAPILogin,
    canListContract,
    controller.list
  );

  router.post('/contracts',
    authorizationMW.requiresAPILogin,
    canCreateContract,
    validateContractPayload,
    controller.create
  );

  router.put('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    checkIdInParams('id', 'Contract'),
    validateContractUpdate,
    controller.update
  );

  router.get('/contracts/:id/orders',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canListOrder,
    controller.listOrders
  );

  router.post('/contracts/:id/orders',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canCreateOrder,
    validateOrderPayload,
    controller.createOrder
  );

  router.put('/contracts/:id/orders/:orderId',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canUpdateOrder,
    checkIdInParams('orderId', 'Order'),
    validateOrderPayload,
    controller.updateOrder
  );
};