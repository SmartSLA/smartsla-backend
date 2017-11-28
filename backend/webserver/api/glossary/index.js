'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canListGlossary,
    canCreateGlossary,
    validateGlossaryCreation
  } = require('./middleware')(dependencies, lib);

  router.get('/glossaries',
    authorizationMW.requiresAPILogin,
    canListGlossary,
    controller.list
  );

  router.post('/glossaries',
    authorizationMW.requiresAPILogin,
    canCreateGlossary,
    validateGlossaryCreation,
    controller.create
  );
};
