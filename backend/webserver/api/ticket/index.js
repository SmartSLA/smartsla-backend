'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const controller = require('./controller')(dependencies, lib);
  const {
    loadTicketToUpdate,
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canUpdateTicket,
    validateTicketCreation,
    validateTicketUpdate
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

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    canUpdateTicket,
    checkIdInParams('id', 'Ticket'),
    loadTicketToUpdate,
    validateTicketUpdate,
    controller.update
  );

  router.get('/tickets/:id/activities',
    authorizationMW.requiresAPILogin,
    canReadTicket,
    controller.getActivities
  );
};
