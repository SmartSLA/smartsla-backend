'use strict';

const Q = require('q');
const _ = require('lodash');

module.exports = function(dependencies, lib) {
  const filestore = dependencies('filestore');
  const activitystreams = dependencies('activitystreams');
  const pubsubLocal = dependencies('pubsub').local;
  const { send404Error, send500Error } = require('../utils')(dependencies);

  const ticketUpdateTopic = pubsubLocal.topic(lib.constants.EVENTS.TICKET.updated);
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
    get,
    update,
    getActivities
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

  /**
   * Update a ticket: update basic info, update state, set/unset workaroundTime/correctionTime.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    let updateTicket;
    let errorMessage;
    const activityData = {
      actor: req.user,
      ticketId: req.params.id,
      verb: lib.constants.TICKET_ACTIVITY.VERBS.update,
      changeset: req.changeset || []
    };

    if (!req.query.action) {
      const changesetKeys = {
        title: 'title',
        description: 'description',
        environment: 'environment',
        demandType: 'demand type',
        severity: 'severity'
      };

      _.transform(req.body, (result, value, key) => {
        if (changesetKeys[key] && !_.isEqual(value, req.ticket[key])) {
          activityData.changeset.push({
            key,
            displayName: changesetKeys[key],
            from: req.ticket[key],
            to: value
          });
        }
      });

      const softwareChange = req.body.software !== undefined ? _buildActivityForUpdateSoftware(req.ticket, req.body.software) : undefined;

      if (softwareChange) activityData.changeset.push(softwareChange);

      updateTicket = lib.ticket.updateById(req.params.id, req.body);
      errorMessage = 'Failed to update ticket';
    }

    switch (req.query.action) {
      case lib.constants.TICKET_ACTIONS.updateState:
        activityData.changeset = [{
          key: 'state',
          displayName: 'state',
          from: req.ticket.state,
          to: req.body.state
        }];
        updateTicket = lib.ticket.updateState(req.ticket, req.body.state);
        errorMessage = 'Failed to update state of ticket';
        break;
      case lib.constants.TICKET_ACTIONS.set:
      case lib.constants.TICKET_ACTIONS.unset:
        activityData.verb = req.query.action;

        if (req.query.field === lib.constants.TICKET_ABLE_TO_SETUP_FIELDS.workaroundTime) {
          activityData.changeset = [{ key: req.query.field, displayName: 'workaround time' }];
          updateTicket = lib.ticket.setWorkaroundTime(req.ticket, req.query.action === lib.constants.TICKET_ACTIONS.set);
        }
        if (req.query.field === lib.constants.TICKET_ABLE_TO_SETUP_FIELDS.correctionTime) {
          activityData.changeset = [{ key: req.query.field, displayName: 'correction time' }];
          updateTicket = lib.ticket.setCorrectionTime(req.ticket, req.query.action === lib.constants.TICKET_ACTIONS.set);
        }

        errorMessage = `Failed to ${req.query.action} ${req.query.field}`;
        break;
    }

    updateTicket
      .then(updatedTicket => {
        if (activityData.changeset.length > 0) {
          ticketUpdateTopic.publish(activityData);
        }
        res.status(200).json(updatedTicket);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  function _buildActivityForUpdateSoftware(ticket, software) {
    if (software === null || _.isEmpty(software)) {
      if (!ticket.software) {
        return;
      }

      return {
        key: 'software',
        displayName: 'software',
        from: `${ticket.software.template.name} ${ticket.software.version} - (${ticket.software.criticality})`
      };
    }

    if (!ticket.software || String(software.template) !== String(ticket.software.template._id)) {
      const softwareTemplate = _.find(ticket.contract.software, item => item.template._id === software.template);

      return {
        key: 'software',
        displayName: 'software',
        from: ticket.software ? `${ticket.software.template.name} ${ticket.software.version} - (${ticket.software.criticality})` : '',
        to: `${softwareTemplate.name} ${software.version} - (${software.type})`
      };
    }

    if (software.version === ticket.software.version && software.criticality === ticket.software.criticality) {
      return;
    }

    return {
      key: 'software',
      displayName: 'software',
      from: ticket.software ? `${ticket.software.template.name} ${ticket.software.version} - (${ticket.software.criticality})` : '',
      to: `${ticket.software.template.name} ${software.version} - (${software.criticality})`
    };
  }

  /**
  * Get ticket's activities.
  *
  * @param {Request} req
  * @param {Response} res
  */
  function getActivities(req, res) {
    const options = {
      limit: +req.query.limit || lib.constants.DEFAULT_LIST_OPTIONS.LIMIT,
      offset: +req.query.offset || lib.constants.DEFAULT_LIST_OPTIONS.OFFSET,
      object: {
        objectType: lib.constants.TICKET_ACTIVITY.OBJECT_TYPE,
        _id: req.params.id
      }
    };

    return Q.ninvoke(activitystreams, 'getTimelineEntries', options)
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error('Failed to get activities of ticket', err, res));
  }
};
