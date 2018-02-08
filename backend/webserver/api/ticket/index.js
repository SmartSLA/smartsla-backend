'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const { checkIdInParams } = dependencies('helperMw');
  const controller = require('./controller')(dependencies, lib);
  const { loadUserRole } = require('../helpers')(dependencies, lib);
  const {
    load,
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canUpdateTicket,
    validateTicketCreation,
    validateTicketUpdate
  } = require('./middleware')(dependencies, lib);
  const TICKET_POPULATIONS = [
    {
      path: 'contract',
      select: 'title organization demands software defaultSupportManager',
      populate: [
        {
          path: 'organization',
          select: 'shortName'
        },
        {
          path: 'software.template',
          select: 'name'
        }
      ]
    },
    {
      path: 'requester',
      select: 'firstname lastname'
    },
    {
      path: 'supportTechnicians',
      select: 'firstname lastname'
    },
    {
      path: 'supportManager',
      select: 'firstname lastname'
    },
    {
      path: 'software.template',
      select: 'name'
    }
  ];

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    canCreateTicket,
    loadContract,
    validateTicketCreation,
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
    checkIdInParams('id', 'Ticket'),
    load('id', { populations: TICKET_POPULATIONS }),
    canReadTicket,
    controller.get
  );

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    load('id', { populations: TICKET_POPULATIONS }),
    canUpdateTicket,
    checkIdInParams('id', 'Ticket'),
    validateTicketUpdate,
    controller.update
  );

  router.get('/tickets/:id/activities',
    authorizationMW.requiresAPILogin,
    loadUserRole,
    load('id', { populations: TICKET_POPULATIONS }),
    canReadTicket,
    controller.getActivities
  );
};
