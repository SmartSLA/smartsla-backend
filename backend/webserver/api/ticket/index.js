'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    loadContract,
    canCreateTicket,
    validateTicketCreation
  } = require('./middleware')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    canCreateTicket,
    loadContract,
    validateTicketCreation,
    controller.create
  );
};
