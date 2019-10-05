'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const middlewares = require('./middleware')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    middlewares.transformTicket,
    controller.create
  );

  router.get('/tickets',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    controller.list
  );

  router.get('/tickets/:id',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    controller.get
  );

  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    middlewares.transformTicketBeforeUpdate,
    controller.update
  );

  router.delete('/tickets/:id',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    controller.remove
  );
};
