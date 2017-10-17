'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  router.post('/userrole',
    authorizationMW.requiresAPILogin,
    middleware.canCreate,
    middleware.validateUserCreatePayload,
    controller.create
  );

  router.put('/userrole/:id',
    authorizationMW.requiresAPILogin,
    middleware.canUpdate,
    checkIdInParams('id', 'User'),
    middleware.validateUserUpdatePayload,
    controller.update
  );
};
