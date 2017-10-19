'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateOrganization,
    canListOrganization,
    canUpdateOrganization,
    validateOrganizationPayload
  } = require('./middleware')(dependencies, lib);

  router.get('/organizations',
    authorizationMW.requiresAPILogin,
    canListOrganization,
    controller.list
  );

  router.post('/organizations',
    authorizationMW.requiresAPILogin,
    canCreateOrganization,
    validateOrganizationPayload,
    controller.create
  );

  router.put('/organizations/:id',
    authorizationMW.requiresAPILogin,
    canUpdateOrganization,
    checkIdInParams('id', 'Organization'),
    validateOrganizationPayload,
    controller.update
  );
};
