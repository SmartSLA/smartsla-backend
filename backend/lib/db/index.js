'use strict';

module.exports = dependencies => {

  const Client = require('./client')(dependencies);
  const Contract = require('./contract')(dependencies);
  const Counter = require('./counter')(dependencies);
  const Contribution = require('./contribution')(dependencies);
  const Filter = require('./filter')(dependencies);
  const Organization = require('./organization')(dependencies);
  const Software = require('./software')(dependencies);
  const Team = require('./team')(dependencies);
  const TicketingUser = require('./ticketing-user')(dependencies);
  const TicketingGlossary = require('./ticketing-glossary')(dependencies);
  const TicketingUserRole = require('./ticketing-user-role')(dependencies);
  const Ticket = require('./ticket')(dependencies);
  const TicketUserContract = require('./ticketing-user-contract')(dependencies);

  return {
    Client,
    Contract,
    Contribution,
    Counter,
    Filter,
    Organization,
    Software,
    Team,
    Ticket,
    TicketingGlossary,
    TicketingUser,
    TicketingUserRole,
    TicketUserContract
  };
};
