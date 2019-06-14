'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateContract,
    canListContract,
    canUpdateContract,
    canReadContract
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
    controller.create
  );

  router.post('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    controller.update
  );
};
