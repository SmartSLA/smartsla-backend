'use strict';

const { DEFAULT_LIST_OPTIONS, TICKET_STATES } = require('./constants');
const { validateTicketState } = require('./helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Ticket = mongoose.model('Ticket');

  return {
    create,
    list,
    listOpenTickets
  };

  /**
   * Create ticket.
   * @param {Object}  ticket  - The ticket object
   * @param {Object}  options - The options object may contain population options
   * @param {Promise}         - Resolve on success
   */
  function create(ticket, options = {}) {
    ticket = ticket instanceof Ticket ? ticket : new Ticket(ticket);

    return Ticket.create(ticket)
      .then(createdTicket => {
        if (options.populations) {
          return createdTicket.populate(options.populations).execPopulate();
        }

        return createdTicket;
      });
  }

  /**
   * List tickets.
   * @param {Object}   options  - The options object, may contain state of ticket, offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {
    if (options.state && !validateTicketState(options.state)) {
      return Promise.resolve([]);
    }

    const findOptions = options.state ? { state: options.state } : {};

    const query = Ticket
      .find(findOptions)
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-updatedAt');

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
   * List tickets with state is not either equal 'Closed' or 'Abandoned'.
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function listOpenTickets(options = {}) {
    const query = Ticket
      .find({ state: { $nin: [TICKET_STATES.CLOSED, TICKET_STATES.ABANDONED] } })
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-updatedAt');

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }
};
