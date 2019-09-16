'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const user = require('./user')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);
  const ticketingUser = require('./ticketing-user')(dependencies);
  const contract = require('./contract')(dependencies);
  const helpers = require('./helpers');
  const constants = require('./constants');
  const listeners = require('./listeners')(dependencies);
  const software = require('./software')(dependencies);
  const team = require('./team')(dependencies);
  const client = require('./client')(dependencies);
  const glossary = require('./ticketing-glossary')(dependencies);
  const ticket = require('./ticket')(dependencies);
  const filter = require('./filter')(dependencies);
  const AccessControl = require('./access-control');
  const email = require('./email')(dependencies);

  return {
    constants,
    contract,
    email,
    helpers,
    models,
    organization,
    software,
    team,
    client,
    glossary,
    start,
    user,
    ticketingUserRole,
    ticketingUser,
    ticket,
    filter,
    accessControl: new AccessControl()
  };

  function start(callback) {
    listeners.init();
    callback();
  }
};
