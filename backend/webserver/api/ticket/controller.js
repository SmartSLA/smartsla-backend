'use strict';

module.exports = function(dependencies, lib) {
  const { TICKETING_USER_TYPES } = require('../constants');
  const { Parser } = require('json2csv');
  const { send200ItemCount, send500Error, send404Error } = require('../utils')(dependencies);

  return {
    addEvent,
    count,
    create,
    list,
    get,
    update,
    updateRelatedContributions,
    remove
  };

  function addEvent(req, res) {
    const event = req.body;
    const ticketId = req.params.id;

    lib.ticket.addEvent(ticketId, event)
      .then(updatedTicket => {
        res.status(200).json(updatedTicket);
      })
      .catch(err => send500Error('failed to add event', err, res));
  }

  /**
   * Update ticket related contributions
   *
   * @param {Request} req
   * @param {Response} res
   */
  function updateRelatedContributions(req, res) {
    const contributions = req.body;
    const ticketId = req.params.id;

    lib.ticket.updateRelatedContributions(ticketId, contributions)
      .then(updatedTicket => {
        if (updatedTicket) {
          return res.status(204).end();
        }

        return send404Error('ticket not found', res);
      })
      .catch(err => send500Error('failed to update related contributions', err, res));
  }

  /**
   * Create a ticket.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    const ticket = res.locals.newTicket;

    if (!ticket) {
      return res.status(500).json('Something went wrong');
    }

    return lib.ticket.create(ticket)
      .then(createdTicket => res.status(201).json(createdTicket))
      .catch(err => send500Error('Failed to create ticket', err, res));
  }

  function exportCsv(tickets, res) {
    lib.cns.exportData(tickets).then(data => {
      const parser = new Parser();
      const csv = parser.parse(data);

      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    });
  }

  /**
   * List tickets.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const isExportCvs = req.query.export === 'csv';
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    if (req.query.filter) {
      options.filter = req.query.filter;
    }

    return lib.ticket.list(req, options)
      .then(tickets => {
        if (isExportCvs) {
          exportCsv(tickets, res);
        } else {
          res.status(200).json(tickets);
        }
      })
      .catch(err => send500Error('Error while getting tickets', err, res));
  }

  /**
   * Get a ticket
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.ticket.getById(req.params.id)
      .then(ticket => {
        lib.ticketingUserRole.userIsAdministrator(req.user._id)
          .then(isAdmin => (isAdmin || (req.ticketingUser && req.ticketingUser.type === TICKETING_USER_TYPES.EXPERT)))
          .then(canReadPrivateComment => {
            if (!canReadPrivateComment) {
              ticket.events = ticket.events.filter(event => !event.isPrivate);
            }

            return res.status(200).json(ticket);
          });
      })
      .catch(err => send500Error('Failed to get ticket', err, res));
  }

  /**
   * Update a ticket
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    const ticket = req.body;
    const ticketId = req.params.id;
    const ticketingUser = req.ticketingUser;

    lib.ticket.updateById(ticketId, ticket, ticketingUser)
      .then(updatedTicket => {
        res.status(200).json(updatedTicket);
      })
      .catch(err => send500Error('failed to update ticket', err, res));
  }

/**
 * Delete a ticket
 *
 * @param {Request} req
 * @param {Response} res
 */
  function remove(req, res) {
    return lib.ticket.removeById(req.params.id)
      .then(deletedTicket => {
        if (deletedTicket) {
          return res.status(204).end();
        }

        return send404Error('ticket not found', res);
      })
      .catch(err => send500Error('Failed to delete ticket', err, res));
  }

/**
 * Count tickets
 *
 * @param {Request} req
 * @param {Response} res
 */
  function count(req, res) {
    return lib.ticket.count(req)
      .then(count => {
        send200ItemCount(count, res);
      })
      .catch(err => send500Error('Cannot count tickets', err, res));
  }
};
