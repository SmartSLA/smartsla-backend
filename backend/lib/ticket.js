'use strict';

const { DEFAULT_LIST_OPTIONS, TICKET_STATES } = require('./constants');
const { validateTicketState, isSuspendedTicketState } = require('./helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Ticket = mongoose.model('Ticket');

  return {
    create,
    list,
    listOpenTickets,
    getById,
    updateById,
    updateState,
    setWorkaroundTime,
    setCorrectionTime
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

  /**
   * Get ticket by ID.
   * @param  {String}   ticketId - The ticket ID
   * @return {Promise}           - Resolve the found ticket
   */
  function getById(ticketId, options = {}) {
    const query = Ticket.findById(ticketId);

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
   * Update a ticket by ID.
   * @param  {String}   ticketId  - The ticket ID
   * @param  {Object}   modified  - The modified ticket object
   * @return {Promise}            - Resolve the updated ticket
   */
  function updateById(ticketId, modified) {
    return Ticket.findByIdAndUpdate(ticketId, { $set: modified }, { new: true }).exec();
  }

  /**
   * Update state of ticket.
   * @param  {Object}   ticket  - The ticket object
   * @param  {String}   state   - New state
   * @return {Promise}          - Resolve the updated ticket
   */
  function updateState(ticket, state) {
    if (ticket.state === state) {
      return Promise.resolve(ticket);
    }

    ticket.times = ticket.times || {};

    if (state === TICKET_STATES.IN_PROGRESS) {
      if (ticket.times.responseTime === undefined) { // set responseTime
        ticket.times.responseTime = Math.round((new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspendTime || 0)); // in minutes
      }

      if (isSuspendedTicketState(state)) { // accumulate suspendTime
        ticket.times.suspendTime = (ticket.times.suspendTime || 0) + Math.round((new Date() - ticket.suspendedAt) / (1000 * 60)); // in minutes
      }
    } else if (isSuspendedTicketState(state) && !isSuspendedTicketState(ticket.state)) { // set suspendedAt
      ticket.times.suspendedAt = new Date();
    }

    ticket.state = state;

    return ticket.save();
  }

  /**
   * Set/unset workaround time of ticket.
   * @param  {Object}   ticket  - The ticket object
   * @param  {Boolean}  set     - Flag to determine should set or unset workaround time
   * @return {Promise}          - Resolve the updated ticket
   */
  function setWorkaroundTime(ticket, set) {
    ticket.times = ticket.times || {};

    if (set) {
      ticket.times.workaroundTime = Math.round((new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspendTime || 0));
    } else {
      ticket.times.workaroundTime = undefined;
    }

    return ticket.save();
  }

  /**
   * Set/unset correction time of ticket.
   * @param  {Object}   ticket  - The ticket object
   * @param  {Boolean}  set     - Flag to determine should set or unset correction time
   * @return {Promise}          - Resolve the updated ticket
   */
  function setCorrectionTime(ticket, set) {
    ticket.times = ticket.times || {};

    if (set) {
      ticket.times.correctionTime = Math.round((new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspendTime || 0));
    } else {
      ticket.times.correctionTime = undefined;
    }

    return ticket.save();
  }
};
