'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateOrganization,
    canReadOrganization,
    canListOrganization,
    canUpdateOrganization,
    validateOrganizationCreatePayload,
    validateOrganizationUpdatePayload
  } = require('./middleware')(dependencies, lib);

  router.get('/organizations',
    authorizationMW.requiresAPILogin,
    canListOrganization,
    controller.list
  );

  router.get('/organizations/:id',
    authorizationMW.requiresAPILogin,
    canReadOrganization,
    checkIdInParams('id', 'Organization'),
    controller.get
  );

  router.post('/organizations',
    authorizationMW.requiresAPILogin,
    canCreateOrganization,
    validateOrganizationCreatePayload,
    controller.create
  );

  router.put('/organizations/:id',
    authorizationMW.requiresAPILogin,
    canUpdateOrganization,
    checkIdInParams('id', 'Organization'),
    validateOrganizationUpdatePayload,
    controller.update
  );
};
