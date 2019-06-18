'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canUpdateTicket
  } = require('./middleware')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    canCreateTicket,
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
    controller.get
  );

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    canUpdateTicket,
    controller.update
  );
};
