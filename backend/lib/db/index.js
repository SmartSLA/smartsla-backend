'use strict';

module.exports = dependencies => {

  const Organization = require('./organization')(dependencies);
  const Contract = require('./contract')(dependencies);
  const TicketingUserRole = require('./ticketing-user-role')(dependencies);
  const TicketingUser = require('./ticketing-user')(dependencies);
  const Software = require('./software')(dependencies);
  const TicketingGlossary = require('./ticketing-glossary')(dependencies);
  const Ticket = require('./ticket')(dependencies);

  return {
    Organization,
    Contract,
    Software,
    TicketingGlossary,
    TicketingUserRole,
    TicketingUser,
    Ticket
  };
};
