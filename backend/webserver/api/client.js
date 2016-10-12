'use strict';

module.exports = function(dependencies, lib, router) {

  const authorizationMW = dependencies('authorizationMW');
  const clientController = require('../controllers/client')(dependencies, lib);
  const clientMW = require('../middlewares/client')(dependencies, lib);

  router.get('/clients', authorizationMW.requiresAPILogin, clientController.listClients);
  router.post('/clients', authorizationMW.requiresAPILogin, clientController.createClient);

  router.get('/clients/:clientId', authorizationMW.requiresAPILogin, clientController.getClient);
  router.put('/clients/:clientId', authorizationMW.requiresAPILogin, clientController.updateClient);
  router.delete('/clients/:clientId', authorizationMW.requiresAPILogin, clientController.removeClient);

  router.param('clientId', clientMW.loadClient);
};
