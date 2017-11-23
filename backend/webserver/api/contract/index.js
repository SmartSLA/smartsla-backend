'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    load,
    canCreateContract,
    canListContract,
    canUpdateContract,
    canCreateOrder,
    canListOrder,
    canReadContract,
    canUpdateOrder,
    validateContractPayload,
    validateOrderPayload,
    validatePermissions,
    validateSoftware
  } = require('./middleware')(dependencies, lib);

  router.get('/contracts',
    authorizationMW.requiresAPILogin,
    canListContract,
    controller.list
  );

  router.get('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canReadContract,
    checkIdInParams('id', 'Contract'),
    controller.get
  );

  router.post('/contracts',
    authorizationMW.requiresAPILogin,
    canCreateContract,
    validateContractPayload,
    controller.create
  );

  router.post('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    checkIdInParams('id', 'Contract'),
    validateContractPayload,
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

  router.post('/contracts/:id/permissions',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canUpdateContract,
    load,
    validatePermissions,
    controller.updatePermissions
  );

  router.post('/contracts/:id/software',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canUpdateContract,
    load,
    validateSoftware,
    controller.addSoftware
  );
};
