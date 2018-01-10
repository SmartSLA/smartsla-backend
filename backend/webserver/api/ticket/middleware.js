'use strict';

module.exports = (dependencies, lib) => {
  const { requireAdministrator, validateObjectIds } = require('../helpers')(dependencies, lib);
  const { send400Error, send500Error } = require('../utils')(dependencies);

  return {
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    validateTicketCreation
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
    const {
      title,
      demandType,
      severity,
      software,
      description,
      environment,
      attachments
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

    if (attachments && (!Array.isArray(attachments) || !validateObjectIds(attachments))) {
      return send400Error('attachments is invalid', res);
    }

    if (software && (!software.template || !software.version || !software.criticality)) {
      return send400Error('software is invalid: template, version and criticality are required', res);
    }

    const softwareCriticality = software && software.criticality ? software.criticality : undefined;

    if (!_validateDemand({ demandType, severity, softwareCriticality }, req.contract.demands)) {
      return send400Error('the triple (demandType, severity, software criticality) is not supported', res);
    }

    if (software && !_validateSoftware(software, req.contract.software)) {
      return send400Error('the pair (software template, software version) is not supported', res);
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
