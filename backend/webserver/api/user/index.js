'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  router.get('/users',
    authorizationMW.requiresAPILogin,
    middleware.canList,
    controller.list
  );

  router.get('/users/:id/isadministrator',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'User'),
    controller.userIsAdministrator
  );

  router.post('/users',
    authorizationMW.requiresAPILogin,
    middleware.canCreate,
    middleware.validateUserCreatePayload,
    controller.create
  );

  router.put('/users/:id',
    authorizationMW.requiresAPILogin,
    middleware.canUpdate,
    checkIdInParams('id', 'User'),
    middleware.validateUserUpdatePayload,
    controller.update
  );
};
