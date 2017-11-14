'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const user = require('./user')(dependencies);
  const organization = require('./organization')(dependencies);
  const ticketingUserRole = require('./ticketing-user-role')(dependencies);
  const contract = require('./contract')(dependencies);
  const order = require('./order')(dependencies);
  const helpers = require('./helpers');
  const constants = require('./constants');
  const listeners = require('./listeners')(dependencies);

  return {
    constants,
    contract,
    helpers,
    start,
    models,
    order,
    organization,
    user,
    ticketingUserRole
  };

  function start(callback) {
    listeners.init();
    callback();
  }
};
