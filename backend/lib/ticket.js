'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Ticket = mongoose.model('Ticket');

  return {
    create
  };

  /**
   * Create ticket.
   * @param {Object}  ticket - The ticket object
   * @param {Promise}        - Resolve on success
   */
  function create(ticket) {
    ticket = ticket instanceof Ticket ? ticket : new Ticket(ticket);

    return Ticket.create(ticket);
  }
};
