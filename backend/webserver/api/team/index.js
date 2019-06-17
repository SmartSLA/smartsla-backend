'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateTeam,
    canListTeam,
    canUpdateTeam
  } = require('./middleware')(dependencies, lib);

  router.get('/team',
    authorizationMW.requiresAPILogin,
    canListTeam,
    controller.list
  );

  router.get('/team/:id',
    authorizationMW.requiresAPILogin,
    canListTeam,
    controller.get
  );

  router.post('/team',
    authorizationMW.requiresAPILogin,
    canCreateTeam,
    controller.create
  );

  router.put('/team/:id',
    authorizationMW.requiresAPILogin,
    canUpdateTeam,
    checkIdInParams('id', 'team'),
    canUpdateTeam,
    controller.update
  );
};
