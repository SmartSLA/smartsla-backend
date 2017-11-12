'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const { canReadOrder } = require('./middleware')(dependencies, lib);

  router.get('/orders/:id',
    authorizationMW.requiresAPILogin,
    canReadOrder,
    checkIdInParams('id', 'Order'),
    controller.get
  );
};
