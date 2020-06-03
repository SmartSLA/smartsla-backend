'use strict';

module.exports = function(dependencies, lib, router) {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  router.get('/dashboard',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    controller.get
  );
};
