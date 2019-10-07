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
    canAddUsersToContract,
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

  router.post('/contracts/:id/users',
    authorizationMW.requiresAPILogin,
    load,
    canAddUsersToContract,
    controller.addUsers
  );

  router.get('/contracts/:id/users',
    authorizationMW.requiresAPILogin,
    load,
    controller.getUsers
  );

  router.delete('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    checkIdInParams('id', 'Contract'),
    controller.remove
  );

};
