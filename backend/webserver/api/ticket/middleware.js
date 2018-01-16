'use strict';

const Q = require('q');
const composableMw = require('composable-middleware');
const CONSTANTS = require('../../constants');

module.exports = (dependencies, lib) => {
  const { requireAdministrator, validateObjectIds } = require('../helpers')(dependencies, lib);
  const { send400Error, send404Error, send500Error } = require('../utils')(dependencies);

  return {
    loadTicketWithContractInfo,
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canUpdateTicket,
    validateTicketCreation,
    validateTicketUpdate
  };

  function canCreateTicket(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListTicket(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canReadTicket(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateTicket(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function loadTicketWithContractInfo(req, res, next) {
    const populations = [
      {
        path: 'contract'
      }
    ];

    lib.ticket.getById(req.params.id, { populations })
      .then(ticket => {
        if (!ticket) {
          return send404Error('Ticket not found', res);
        }

        req.ticket = ticket;
        next();
      })
      .catch(err => send500Error('Failed to load ticket', err, res));
  }

  function loadContract(req, res, next) {
    if (!req.body.contract) {
      return send400Error('contract is required', res);
    }

    if (!validateObjectIds(req.body.contract)) {
      return send400Error('contract is invalid', res);
    }

    lib.contract.getById(req.body.contract)
      .then(contract => {
        if (!contract) {
          return send400Error('contract not found', res);
        }

        req.contract = contract;
        next();
      })
      .catch(err => send500Error('Unable to check contract', err, res));
  }

  function validateTicketCreation(req, res, next) {
    const { attachments } = req.body;

    if (attachments && (!Array.isArray(attachments) || !validateObjectIds(attachments))) {
      return send400Error('attachments is invalid', res);
    }

    _validateTicketBasicInfo(req, res, next);
  }

  function _validateTicketBasicInfo(req, res, next) {
    const {
      title,
      demandType,
      severity,
      software,
      description,
      environment
    } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!demandType) {
      return send400Error('demandType is required', res);
    }

    if (!description || typeof description !== 'string' || description.length < 50) {
      return send400Error('description is required and must be a string with minimum length of 50', res);
    }

    if (environment && typeof environment !== 'string') {
      return send400Error('environment must be a string', res);
    }

    if (software && (!software.template || !software.version || !software.criticality)) {
      return send400Error('software is invalid: template, version and criticality are required', res);
    }

    const softwareCriticality = software && software.criticality ? software.criticality : undefined;
    const contract = req.contract || req.ticket.contract;

    if (!_validateDemand({ demandType, severity, softwareCriticality }, contract.demands)) {
      return send400Error('the triple (demandType, severity, software criticality) is not supported', res);
    }

    if (software && !_validateSoftware(software, contract.software)) {
      return send400Error('the pair (software template, software version) is not supported', res);
    }

    next();
  }

  function validateTicketUpdate(req, res, next) {
    if (!req.query.action) {
      return composableMw(_validateTicketBasicInfo, _validateTicketRequester, _validateTicketSupportManager, _validateTicketSupportTechnicians)(req, res, next);
    }

    if (req.query.action === CONSTANTS.TICKET_ACTIONS.updateState) {
      return _validateTicketState(req, res, next);
    }

    if ([CONSTANTS.TICKET_ACTIONS.set, CONSTANTS.TICKET_ACTIONS.unset].indexOf(req.query.action) === -1 ||
        ['workaroundTime', 'correctionTime'].indexOf(req.query.field) === -1) {
      return send400Error(`${req.query.action} is not a valid action on field ${req.query.field} of ticket`, res);
    }

    next();
  }

  function _validateTicketState(req, res, next) {
    const { state } = req.body;

    if (!state) {
      return send400Error('state is required', res);
    }

    if (!lib.helpers.validateTicketState(state)) {
      return send400Error('state is invalid', res);
    }

    if (req.ticket.state !== lib.constants.TICKET_STATES.NEW && state === lib.constants.TICKET_STATES.NEW) {
      return send400Error('change state of ticket to New is not supported', res);
    }

    next();
  }

  function _validateTicketRequester(req, res, next) {
    const { requester } = req.body;

    if (!requester) {
      return send400Error('requester is required', res);
    }

    if (!validateObjectIds(requester)) {
      return send400Error('requester is invalid', res);
    }

    lib.user.getById(requester)
      .then(user => {
        if (!user) {
          return send400Error('requester not found', res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check requester', err, res));
  }

  function _validateTicketSupportManager(req, res, next) {
    const { supportManager } = req.body;

    if (!supportManager) {
      return send400Error('supportManager is required', res);
    }

    if (!validateObjectIds(supportManager)) {
      return send400Error('supportManager is invalid', res);
    }

    lib.user.getById(supportManager)
      .then(user => {
        if (!user) {
          return send400Error('supportManager not found', res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check supportManager', err, res));
  }

  function _validateTicketSupportTechnicians(req, res, next) {
    const { supportTechnicians } = req.body;

    if (supportTechnicians) {
      if (!Array.isArray(supportTechnicians) || !validateObjectIds(supportTechnicians)) {
        return send400Error('supportTechnicians is invalid', res);
      }

      return Q.all(supportTechnicians.map(lib.user.getById))
        .then(users => {
          const notFoundUsers = supportTechnicians.filter((userId, index) => !users[index]);

          if (notFoundUsers.length > 0) {
            return send400Error(`supportTechnicians ${notFoundUsers} are not found`, res);
          }

          next();
        })
        .catch(err => send500Error('Unable to check supportTechnicians', err, res));
    }

    next();
  }

  function _validateDemand(demand, availableDemands) {
    return availableDemands.some(item => (item.demandType === demand.demandType) &&
                                         (item.issueType === demand.severity) &&
                                         (item.softwareType === demand.softwareCriticality));
  }

  function _validateSoftware(software, availableSoftware) {
    return availableSoftware.some(item => (String(item.template) === String(software.template)) &&
                                          (item.versions.indexOf(software.version) > -1) &&
                                          (item.type === software.criticality));
  }
};
