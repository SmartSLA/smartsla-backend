'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);
  const contract = require('./contract')(dependencies);
  const helpers = require('./helpers');

  return {
    contract,
    helpers,
    models,
    organization,
    ticketingUserRole
  };
};
