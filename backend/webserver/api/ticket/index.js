'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const { loadUserRole } = require('../helpers')(dependencies, lib);
  const {
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canUpdateTicket
  } = require('./middleware')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    canCreateTicket,
    controller.create
  );

  router.get('/tickets',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    canListTicket,
    controller.list
  );

  router.get('/tickets/:id',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    canReadTicket,
    controller.get
  );

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    canUpdateTicket,
    controller.update
  );
};
