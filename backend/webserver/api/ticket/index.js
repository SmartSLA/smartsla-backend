'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const controller = require('./controller')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    controller.create
  );

  router.get('/tickets',
    authorizationMW.requiresAPILogin,
    controller.list
  );

  router.get('/tickets/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'Ticket'),
    controller.get
  );

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    controller.update
  );
};
