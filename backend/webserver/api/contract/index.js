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
    canReadContract,
    validateContractPayload,
    validateDemand,
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

  router.post('/contracts/:id/demands',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Contract'),
    canUpdateContract,
    load,
    validateDemand,
    controller.addDemand
  );
};
