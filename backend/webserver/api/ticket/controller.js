'use strict';

module.exports = function(dependencies, lib) {
  const { send500Error } = require('../utils')(dependencies);

  return {
    create,
    list,
    get,
    update
  };

  /**
   * Create a ticket.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.ticket.create(req.body)
      .then(createdTicket => res.status(201).json(createdTicket))
      .catch(err => send500Error('Failed to create ticket', err, res));
  }

  /**
   * List tickets.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    return lib.ticket.list(options)
      .then(tickets => {
        res.header('X-ESN-Items-Count', tickets.length);
        res.status(200).json(tickets);
      })
      .catch(err => send500Error('Failed to list tickets', err, res));
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
        ticket = ticket.toObject();

        return res.status(200).json(ticket);

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
    lib.ticket.updateById(req.params.id, req.body)
      .then(updatedTicket => {
        res.status(200).json(updatedTicket);
      })
      .catch(err => send500Error('failed to update ticket', err, res));
  }
};
