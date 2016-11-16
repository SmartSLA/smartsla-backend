'use strict';

module.exports = function(dependencies, lib, router) {

  const authorizationMW = dependencies('authorizationMW');
  const groupController = require('../controllers/group')(dependencies, lib);
  const groupMW = require('../middlewares/group')(dependencies, lib);

  router.get('/groups', authorizationMW.requiresAPILogin, groupController.listGroups);
  router.post('/groups', authorizationMW.requiresAPILogin, groupController.createGroup);
  router.delete('/groups', authorizationMW.requiresAPILogin, groupController.removeGroups);

  router.get('/groups/:groupId', authorizationMW.requiresAPILogin, groupController.getGroup);
  router.put('/groups/:groupId', authorizationMW.requiresAPILogin, groupController.updateGroup);
  router.delete('/groups/:groupId', authorizationMW.requiresAPILogin, groupController.removeGroup);

  router.param('groupId', groupMW.loadGroup);

};
