module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  router.get('/roles',
    authorizationMW.requiresAPILogin,
    middleware.canList,
    controller.list
  );

  router.post('/roles',
    authorizationMW.requiresAPILogin,
    middleware.canCreateRoles,
    controller.createRoles
  );

  router.post('/roles/:id',
    authorizationMW.requiresAPILogin,
    middleware.loadRole,
    middleware.canUpdateRole,
    controller.updateRole
  );
};
