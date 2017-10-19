'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateContract,
    canListContract,
    canUpdateContract,
    validateContractPayload,
    validateContractUpdate
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
};
