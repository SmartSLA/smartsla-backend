'use strict';

module.exports = function(dependencies, lib) {
  const { send500Error } = require('../utils')(dependencies);

  return {
    create,
    list
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

  /**
   * List tickets.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let listTickets;
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset,
      state: req.query.state
    };
    const userPopulationFields = 'firstname lastname';

    options.populations = [
      {
        path: 'contract',
        select: 'title organization demands',
        populate: {
          path: 'organization',
          select: 'shortName'
        }
      },
      {
        path: 'supportTechnicians',
        userPopulationFields
      },
      {
        path: 'supportManager',
        select: userPopulationFields
      },
      {
        path: 'software.template',
        select: 'name'
      }
    ];

    // there is not "open" state of ticket
    // list open tickets is list tickets with state is not either equal 'Closed' or 'Abandoned'
    if (options.state === 'open') {
      listTickets = lib.ticket.listOpenTickets(options);
    } else {
      listTickets = lib.ticket.list(options);
    }

    return listTickets
      .then(tickets => {
        res.header('X-ESN-Items-Count', tickets.length);
        res.status(200).json(tickets);
      })
      .catch(err => send500Error('Failed to list tickets', err, res));
  }
};
