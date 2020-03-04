'use strict';

const { DEFAULT_LIST_OPTIONS, TICKET_STATUS, EVENTS, EMAIL_NOTIFICATIONS } = require('../constants');
const { validateTicketState, isSuspendedTicketState } = require('../helpers');
const { diff } = require('deep-object-diff');
const { computeCns } = require('../cns');

const DEFAULT_TICKET_POPULATES = [
  { path: 'software.software' }
];

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Ticket = mongoose.model('Ticket');
  const Contract = mongoose.model('Contract');
  const email = require('../email')(dependencies);
  const pubsubLocal = dependencies('pubsub').local;
  const logger = dependencies('logger');
  const ticketDeletedTopic = pubsubLocal.topic(EVENTS.TEAM.deleted);

  return {
    create,
    list,
    listForContracts,
    getById,
    updateById,
    removeById,
    addEvent,
    updateState,
    setWorkaroundTime,
    setCorrectionTime
  };

  /**
   * Add event to a ticket
   *
   * Update ticket status and/or assignedTo if modified by event
   *
   * @param {Object}  ticketId - The ticket Id
   * @param {Object}  event    - The event to add
   * @return {Promise}          - Resolve on success
   */
  function addEvent(ticketId, event) {
    const set = {};

    if (event.status) {
      set.status = event.status;
    }

    if (event.target) {
      set.assignedTo = event.target;

      if (event.target.type === 'expert') {
        set.responsible = event.target;
      }
    }

    return Ticket.findByIdAndUpdate(ticketId, { $push: { events: event }, $set: set }, { new: true })
      .exec()
      .then(modifiedTicket => {
        email.send(EMAIL_NOTIFICATIONS.TYPES.UPDATED, modifiedTicket, event);
      });
  }

  /**
   * Create ticket.
   * @param {Object}  ticket  - The ticket object
   * @param {Object}  options - The options object may contain population options
   * @return {Promise}         - Resolve on success
   */
  function create(ticket, options = {}) {
    ticket = ticket instanceof Ticket ? ticket : new Ticket(ticket);

    return Ticket.create(ticket).then(createdTicket => {
      email.send(EMAIL_NOTIFICATIONS.TYPES.CREATED, createdTicket);

      if (options.populations) {
        return createdTicket.populate(options.populations).execPopulate();
      }

      return createdTicket._id;
    });
  }

  /**
   * List tickets.
   * @param {Object}  options - The options object, may contain states of ticket, requester, supportManager, supportTechnician, offset and limit
   * @return {Promise}         - Resolve on success
   */
  function list(options = {}) {
    return Promise.all([
      count(options),
      list(options).then(addCnsToTickets)
    ]).then(result => ({
      size: result[0],
      list: result[1]
    }));

    function count(options) {
      return buildQuery(options).count().exec();
    }

    function list(options = {}) {
      options.populations = DEFAULT_TICKET_POPULATES.concat(options.populations || []);

      const query = buildQuery(options)
        .lean()
        .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
        .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
        .sort('-timestamps.createdAt');

      return query.exec();
    }

    function buildQuery(options) {
      const findOptions = {};

      if (options.states && options.states.length > 0) {
        const states = options.states.filter(state => validateTicketState(state));

        if (states.length === 0) {
          return Promise.resolve([]);
        }

        findOptions.state = { $in: states };
      }

      const orFilter = [];

      if (options.requester) {
        orFilter.push({ requester: options.requester });
      }

      if (options.supportManager) {
        orFilter.push({ supportManager: options.supportManager });
      }

      if (options.supportTechnician) {
        orFilter.push({ supportTechnicians: options.supportTechnician });
      }

      const query = Ticket.find(findOptions);

      if (options.populations) {
        query.populate(options.populations);
      }

      if (orFilter.length > 0) {
        query.or(orFilter);
      }

      return query;
    }
  }

  function listForContracts(contracts, options = {}) {
    return Promise.all([
      count(contracts),
      list(contracts, options)
    ]).then(result => ({
      size: result[0],
      list: result[1]
    }));

    function count(contracts) {
      return buildQuery(contracts).count().exec();
    }

    function list(contracts, options) {
      const query = buildQuery(contracts)
        .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
        .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
        .sort('-timestamps.createdAt')
        .populate(DEFAULT_TICKET_POPULATES);

        return query.lean()
        .then(tickets => {
          if (options.userType && options.userType === 'expert') {
            return tickets;
          }

          return ticketsWithPublicComments(tickets);
        });
    }

    function ticketsWithPublicComments(tickets) {
      return (tickets || []).map(({events, ...ticket}) => ({
          ...ticket,
          events: (events || []).filter(event => !event.isPrivate)
      }));
    }

    function buildQuery(contracts) {
      const findOptions = {
        contract: { $in: contracts }
      };

      return Ticket.find(findOptions);
    }
  }

  /**
   * Get ticket by ID.
   * @param  {String}   ticketId - The ticket ID
   * @param {Object}    options - Db query options
   * @return {Promise}  - Resolve the found ticket
   */
  function getById(ticketId, options = {}) {
    options.populations = DEFAULT_TICKET_POPULATES.concat(options.populations || []);

    return Ticket
      .findById(ticketId)
      .populate(options.populations)
      .lean()
      .exec()
      .then(addCnsToTicket);
  }

  /**
   * Update a ticket by ID.
   * @param  {String}   ticketId  - The ticket ID
   * @param  {Object}   modified  - The modified ticket object
   * @return {Promise}            - Resolve the updated ticket
   */
  function updateById(ticketId, modified, ticketingUser) {
    return getById(ticketId)
    .then(ticket => _pushEvent(ticket, modified, ticketingUser))
    .then(({unsetValues, modified}) => {
      //Need this because we can't pass an empty object to $unset
      const updateSet = Object.keys(unsetValues).length !== 0 ? {$set: modified, $unset: unsetValues} : { $set: modified };

      return Ticket.findByIdAndUpdate(ticketId, updateSet, { new: true })
        .exec()
        .then(updatedTicket => {
          email.send(EMAIL_NOTIFICATIONS.TYPES.UPDATED, updatedTicket, modified);

          return updatedTicket;
        });
    })
    .catch(err => logger.error(`Error while updating the ticket: ${ticketId}`, err));

    function _pushEvent(ticket, modified, ticketingUser) {
      ticket = ticket.toObject();
      const ticketFields = _getTicketFields(ticket);
      const modifiedTicketFields = _getTicketFields(modified);
      const changes = _getChanges(ticketFields, modifiedTicketFields);

      const unsetValues = {};

      return new Promise(resolve => {

        if (!modified.hasOwnProperty('software')) {
          unsetValues.software = 1;
        }

        if (!modified.hasOwnProperty('severity')) {
          unsetValues.severity = 1;
        }

        if (changes.length !== 0) {
          const { events } = modified;

          const event = {
            author: {
              id: ticketingUser.user,
              name: ticketingUser.name,
              type: ticketingUser.type
            },
            changes: changes
          };

          events.push(event);
          modified.events = events;

          resolve({unsetValues, modified});
        }
        resolve({unsetValues, modified});
      });

    }

    function _getTicketFields(ticket) {
      const {
        title,
        beneficiary,
        responsible,
        callNumber,
        meetingId,
        type,
        severity,
        description,
        participants,
        relatedRequests
      } = ticket;

      //TODO: Add participants, related request
      let ticketFields = Object.assign({}, { title, beneficiary, responsible, callNumber, meetingId, type, severity, description, participants, relatedRequests});

      if (ticket.software && Object.keys(ticket.software).length && ticket.software.software) {
        const software = {
          ...ticket.software,
          software: {
            _id: ticket.software.software._id.toString(),
            name: `${ticket.software.software.name} ${ticket.software.version} ${ticket.software.os}`
          }
        };

        ticketFields = {
          ...ticketFields,
          software
        };
      }

      return ticketFields;
    }

    function _getChanges(ticketFields, modifiedTicketFields) {
      const changes = [];
      const diffs = Object.entries(diff(ticketFields, modifiedTicketFields));
      const config = {
        software: 'software.name',
        beneficiary: 'name',
        responsible: 'name'
      };

      let oldValue = '';
      let newValue = '';
      let action = 'changed';

      for (const [field, value] of diffs) {
        switch (true) {
          case typeof value === 'string':
          case typeof value === 'undefined' && field === 'severity':
            oldValue = ticketFields[field] ? ticketFields[field] : '';
            newValue = value || '';
            break;
          case field === 'participants':
            oldValue = ticketFields[field] ? ticketFields[field].join(' ') : '';
            newValue = modifiedTicketFields[field] ? modifiedTicketFields[field].join(' ') : '';
            break;
          case field === 'relatedRequests':
            oldValue = ticketFields[field] ? ticketFields[field].map(related => _humanizeRelatedRequest(related)).join(', ') : '';
            newValue = ticketFields[field] ? modifiedTicketFields[field].map(related => _humanizeRelatedRequest(related)).join(', ') : '';
          break;
          case typeof value === 'object':
          case typeof value === 'undefined' && field === 'software':
            if (ticketFields[field]) {
              oldValue = config[field].split('.').reduce((o, i) => o[i], ticketFields[field]);
            }
            newValue = value ? config[field].split('.').reduce((o, i) => o[i], value) : '';
            break;
        }

        if (oldValue.length !== 0 && newValue.length === 0) {
          action = 'removed';
        } else if (oldValue.length === 0 && newValue.length !== 0) {
          action = 'added';
        } else {
          action = 'changed';
        }

        changes.push({
          field,
          oldValue,
          newValue,
          action
        });
      }

      return changes;
    }
  }

  function _humanizeRelatedRequest(relatedRequest) {
    const { link, request } = relatedRequest;

    return `${link} #${request.id}-${request.title}`;
  }

  /**
   * Update state of ticket.
   * @param  {Object}   ticket  - The ticket object
   * @param  {String}   state   - New state
   * @return {Promise}          - Resolve the updated ticket
   *
   * @deprecated The times computing aren't relevent anymore, needs update !!!
   */
  function updateState(ticket, state) {
    if (ticket.state === state) {
      return Promise.resolve(ticket);
    }

    ticket.times = ticket.times || {};

    if (state === TICKET_STATUS.SUPPORTED) {
      if (ticket.times.response === undefined) {
        // set response time
        ticket.times.response = Math.round(
          (new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspend || 0)
        ); // in minutes
      }

      if (isSuspendedTicketState(state)) {
        // accumulate suspend time
        ticket.times.suspend =
          (ticket.times.suspend || 0) + Math.round((new Date() - ticket.suspendedAt) / (1000 * 60)); // in minutes
      }
    } else if (isSuspendedTicketState(state) && !isSuspendedTicketState(ticket.state)) {
      // set suspendedAt
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
      ticket.times.workaround = Math.round(
        (new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspend || 0)
      );
    } else {
      ticket.times.workaround = undefined;
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
      ticket.times.correction = Math.round(
        (new Date() - ticket.creation) / (1000 * 60) - (ticket.times.suspend || 0)
      );
    } else {
      ticket.times.correction = undefined;
    }

    return ticket.save();
  }

  /**
  * Remove ticket by ID
  * @param {String}   ticketId - The software ID
  * @return {Promise}             - Resolve on success
  */
  function removeById(ticketId) {
    return Ticket.findByIdAndRemove(ticketId).then(deletedTicket => {
      if (deletedTicket) {
        ticketDeletedTopic.publish(deletedTicket);
      }

      return deletedTicket;
    });
  }

  function addCnsToTicket(ticket) {
    return Contract.findById(ticket.contract).lean().exec()
      .then(contract => {
        ticket.cns = computeCns(ticket, contract);

        return Promise.resolve(ticket);
      });
  }

  function addCnsToTickets(tickets) {
    return Promise.all(tickets.map(addCnsToTicket));
  }
};
