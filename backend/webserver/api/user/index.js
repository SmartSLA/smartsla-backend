'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const domainMW = dependencies('domainMW');
  const { checkIdInParams } = dependencies('helperMw');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

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
    middleware.canCreate,
    domainMW.loadSessionDomain,
    controller.create
  );

  router.put('/users/:id',
    authorizationMW.requiresAPILogin,
    middleware.canUpdate,
    checkIdInParams('id', 'User'),
    controller.update
  );

  router.get('/user',
    authorizationMW.requiresAPILogin,
    domainMW.loadSessionDomain,
    userMiddleware.loadTicketingUser,
    controller.getCurrentUser
  );

  router.get('/user/role',
    authorizationMW.requiresAPILogin,
    controller.getRole
  );

  router.delete('/users/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'User'),
    userMiddleware.canUpdate,
    controller.remove
  );
};
