'use strict';

const Q = require('q');

module.exports = function(dependencies, lib) {
  const filestore = dependencies('filestore');
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const TICKET_POPULATIONS = [
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
      select: 'firstname lastname'
    },
    {
      path: 'supportManager',
      select: 'firstname lastname'
    },
    {
      path: 'software.template',
      select: 'name'
    }
  ];

  return {
    create,
    list,
    get
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
      attachments: req.body.attachments
    };

    // requester = current user
    newTicket.requester = req.user._id;
    // supportManager = defaultSupportManager of contract
    newTicket.supportManager = req.contract.defaultSupportManager;

    return lib.ticket.create(newTicket, { populations: TICKET_POPULATIONS })
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

    options.populations = TICKET_POPULATIONS;

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

  /**
   * Get ticket.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    lib.ticket.getById(req.params.id, { populations: [...TICKET_POPULATIONS, { path: 'requester', select: 'firstname lastname' }] })
      .then(ticket => {
        if (!ticket) {
          return send404Error('Ticket not found', res);
        }

        const promises = ticket.attachments.map(attachment => Q.ninvoke(filestore, 'getMeta', attachment));

        return Q.all(promises)
          .then(result => {
            ticket = ticket.toObject();
            ticket.attachments = result;

            res.status(200).json(ticket);
          });
      })
      .catch(err => send500Error('Failed to get ticket', err, res));
  }
};
