'use strict';

module.exports = dependencies => {

  const Organization = require('./organization')(dependencies);
  const Contract = require('./contract')(dependencies);
  const Order = require('./order')(dependencies);
  const TicketingUserRole = require('./ticketing-user-role')(dependencies);
  const Software = require('./software')(dependencies);
  const TicketingGlossary = require('./ticketing-glossary')(dependencies);

  return {
    Organization,
    Contract,
    Order,
    Software,
    TicketingGlossary,
    TicketingUserRole
  };
};
