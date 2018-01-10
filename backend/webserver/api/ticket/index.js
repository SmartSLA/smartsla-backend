'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const controller = require('./controller')(dependencies, lib);
  const {
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    validateTicketCreation
  } = require('./middleware')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    canCreateTicket,
    loadContract,
    validateTicketCreation,
    controller.create
  );

  router.get('/tickets',
    authorizationMW.requiresAPILogin,
    canListTicket,
    controller.list
  );

  router.get('/tickets/:id',
    authorizationMW.requiresAPILogin,
    canReadTicket,
    checkIdInParams('id', 'Ticket'),
    controller.get
  );
};
