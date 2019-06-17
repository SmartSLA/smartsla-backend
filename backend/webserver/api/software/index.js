'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateSoftware,
    canListSoftware,
    canUpdateSoftware,
    validateSoftwareUpdatePayload
  } = require('./middleware')(dependencies, lib);

  router.get('/software',
    authorizationMW.requiresAPILogin,
    canListSoftware,
    controller.list
  );

  router.get('/software/:id',
    authorizationMW.requiresAPILogin,
    canListSoftware,
    controller.get
  );

  router.post('/software',
    authorizationMW.requiresAPILogin,
    canCreateSoftware,
    controller.create
  );

  router.put('/software/:id',
    authorizationMW.requiresAPILogin,
    canUpdateSoftware,
    checkIdInParams('id', 'Software'),
    validateSoftwareUpdatePayload,
    controller.update
  );
};
