'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const cns = require('./cns')(dependencies);
  const dashboard = require('./dashboard')(dependencies);
  const filter = require('./filter');
  const user = require('./user')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);
  const ticketingUser = require('./ticketing-user')(dependencies);
  const contract = require('./contract')(dependencies);
  const contribution = require('./contribution')(dependencies);
  const helpers = require('./helpers');
  const constants = require('./constants');
  const listeners = require('./listeners')(dependencies);
  const software = require('./software')(dependencies);
  const team = require('./team')(dependencies);
  const client = require('./client')(dependencies);
  const glossary = require('./ticketing-glossary')(dependencies);
  const ticket = require('./ticket')(dependencies);
  const customFilter = require('./custom-filter')(dependencies);
  const AccessControl = require('./access-control');
  const email = require('./email')(dependencies);

  return {
    cns,
    constants,
    contract,
    contribution,
    email,
    dashboard,
    filter,
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
    customFilter,
    accessControl: new AccessControl()
  };

  function start(callback) {
    listeners.init();

    require('./config')(dependencies).register();

    callback();
  }
};
