'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);

  return {
    models,
    organization,
    ticketingUserRole
  };
};
