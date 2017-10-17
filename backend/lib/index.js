'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const coreUser = require('./core-user')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);
  const contract = require('./contract')(dependencies);
  const order = require('./order')(dependencies);
  const helpers = require('./helpers');

  return {
    contract,
    helpers,
    models,
    order,
    organization,
    ticketingUserRole,
    coreUser
  };
};
