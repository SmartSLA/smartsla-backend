'use strict';

module.exports = dependencies => {
  const organization = require('./organization')(dependencies);
  const software = require('./software')(dependencies);
  const contract = require('./contract')(dependencies);
  const ticket = require('./ticket')(dependencies);

  return {
    init
  };

  function init() {
    organization.registerListener();
    software.registerListener();
    contract.registerListener();
    ticket.registerListener();
  }
};
