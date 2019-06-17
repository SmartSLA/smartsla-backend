'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateClient,
    canListClient,
    canUpdateClient
  } = require('./middleware')(dependencies, lib);

  router.get('/client',
    authorizationMW.requiresAPILogin,
    canListClient,
    controller.list
  );

  router.get('/client/:id',
    authorizationMW.requiresAPILogin,
    canListClient,
    controller.get
  );

  router.post('/client',
    authorizationMW.requiresAPILogin,
    canCreateClient,
    controller.create
  );

  router.put('/client/:id',
    authorizationMW.requiresAPILogin,
    canUpdateClient,
    checkIdInParams('id', 'client'),
    canUpdateClient,
    controller.update
  );
};
