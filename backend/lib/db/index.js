'use strict';

module.exports = dependencies => {

  const Organization = require('./organization')(dependencies);
  const Contract = require('./contract')(dependencies);
  const TicketingUserRole = require('./ticketing-user-role')(dependencies);
  const TicketingUser = require('./ticketing-user')(dependencies);
  const Software = require('./software')(dependencies);
  const Team = require('./team')(dependencies);
  const Client = require('./client')(dependencies);
  const TicketingGlossary = require('./ticketing-glossary')(dependencies);
  const Ticket = require('./ticket')(dependencies);
  const Filter = require('./filter')(dependencies);

  return {
    Organization,
    Contract,
    Software,
    Client,
    Team,
    TicketingGlossary,
    TicketingUserRole,
    TicketingUser,
    Ticket,
    Filter
  };
};
