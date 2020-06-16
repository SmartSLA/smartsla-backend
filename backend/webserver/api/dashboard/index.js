'use strict';

module.exports = function(dependencies, lib, router) {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const { flipFeature } = require('../helpers')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  router.get('/dashboard',
    authorizationMW.requiresAPILogin,
    flipFeature('isDashboardEnabled'),
    userMiddleware.loadTicketingUser,
    controller.get
  );
};
