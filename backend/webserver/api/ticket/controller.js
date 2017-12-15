'use strict';

module.exports = function(dependencies, lib) {
  const { send500Error } = require('../utils')(dependencies);

  return {
    create
  };

  /**
   * Create a ticket.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    const newTicket = {
      contract: req.body.contract,
      title: req.body.title,
      demandType: req.body.demandType,
      severity: req.body.severity,
      software: req.body.software,
      description: req.body.description,
      environment: req.body.environment,
      files: req.body.files
    };

    // requester = current user
    newTicket.requester = req.user._id;
    // supportManager = defaultSupportManager of contract
    newTicket.supportManager = req.contract.defaultSupportManager;

    return lib.ticket.create(newTicket)
      .then(ticket => res.status(201).json(ticket))
      .catch(err => send500Error('Failed to create ticket', err, res));
  }
};
