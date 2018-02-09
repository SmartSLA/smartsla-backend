'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { loadDomainByHostname } = dependencies('domainMW');
  const { checkIdInParams } = dependencies('helperMw');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  router.get('/users',
    authorizationMW.requiresAPILogin,
    middleware.canList,
    controller.list
  );

  router.get('/users/:id',
    authorizationMW.requiresAPILogin,
    middleware.canRead,
    checkIdInParams('id', 'User'),
    controller.get
  );

  router.post('/users',
    authorizationMW.requiresAPILogin,
    loadDomainByHostname,
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

  router.get('/user/role',
    authorizationMW.requiresAPILogin,
    controller.getRole
  );
};
