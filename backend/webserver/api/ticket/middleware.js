const Q = require('q');
const composableMw = require('composable-middleware');
const _ = require('lodash');
const { TICKET_ACTIONS, ID_OSSA_CONVERTION } = require('../constants');
const moment = require('moment-timezone');
const business = require('moment-business');

moment.tz.setDefault('Europe/Paris');

module.exports = (dependencies, lib) => {
  const {
    buildUserDisplayName,
    validateObjectIds
  } = require('../helpers')(dependencies, lib);
  const { send400Error, send403Error, send404Error, send500Error } = require('../utils')(dependencies);

  return {
    checkTicketIdInParams,
    load,
    loadTicket,
    loadContract,
    canCreateTicket,
    canListTicket,
    canReadTicket,
    canDeleteTicket,
    canUpdateTicket,
    validateTicketCreation,
    validateTicketUpdate,
    transformTicket
  };

  function checkTicketIdInParams(req, res, next) {
    if (isNaN(req.params.id)) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Not Found',
          details: 'Ticket Id not valid'
        }
      });
    }

    next();
  }

  function transformTicket(req, res, next) {
    const ticket = req.body;
    // For now the beneficiary is by default the author
    // Later we should had it in the ticket creation
    const beneficiary = ticket.author;

    return lib.contract.getById(ticket.contract)
      .then(contract => {
        let idOssa;

        if (ticket.software && ticket.software.critical) {
          const {critical} = ticket.software; //Depending on the software and the contract engagements we get differents idOssa
          const OssaDescription = contract.Engagements[critical].engagements[0].idOssa; //we need to convert that idOssa to a number

          idOssa = {
            // We might has well save the two infos
            id: ID_OSSA_CONVERTION[OssaDescription],
            OssaDescription
          };
        } else {
          idOssa = {
            id: 0,
            OssaDescription: 'Not found'
          };
        }

        const createdDuringBusinessHours = isInBusinessHours(contract);

        res.locals.newTicket = { ...ticket, beneficiary, idOssa, createdDuringBusinessHours };

        return next();

        function isInBusinessHours(contract) {
          if (contract.features && contract.features.nonBusinessHours) {
            const currentDate = moment();
            const currentHour = currentDate.hour();

            if (business.isWeekendDay(currentDate)) {
              return false;
            }

            if (contract.businessHours && contract.businessHours.start && contract.businessHours.end) {
              return (currentHour >= contract.businessHours.start && currentHour < contract.businessHours.end);
            }

            return false;
          }

          return true;
        }
      })
      .catch(err => send500Error('Unable to compute ticket OssaId', err, res));
  }

  function canCreateTicket(req, res, next) {
    // TODO: Check that the ticket can be created in the given contract
    next();
  }

  function canListTicket(req, res, next) {
    // TODO
    next();
  }

  function canReadTicket(req, res, next) {
    lib.ticketingUserRole.userIsAdministrator(req.user._id)
      .then(isAdmin => (isAdmin || (req.ticketingUser && req.ticketingUser.type === 'expert')))
      .then(canViewAll => {
        if (canViewAll) {
          return next();
        }

        return userCanReadTicket(req.user, req.ticket)
          .then(canRead => (canRead ? next() : send403Error('User does not have permission to read ticket', res)));
      })
      .catch(err => send500Error('Unable to check ticket rights', err, res));

    function userCanReadTicket(user, ticket) {
      return lib.contract.listForUser(user._id)
        .then(contracts => {
          if (!contracts || !contracts.length) {
            return false;
          }

          const contractIds = contracts.map(contract => String(contract.contract));

          return contractIds.includes(String(ticket.contract._id));
        });
    }
  }

  function canUpdateTicket(req, res, next) {
    // TODO: Check that the user is admin, expert or part of the ticket contract
    next();
  }

  function canDeleteTicket(req, res) {
    // TODO
    return send403Error('User does not have permission to delete ticket', res);
  }

  function loadTicket(req, res, next) {
    lib.ticket.getById(req.params.id)
      .then(ticket => {
        if (!ticket) {
          return send404Error('Ticket not found', res);
        }

        req.ticket = ticket;
        next();
      })
      .catch(err => send500Error('Failed to load ticket', err, res));
  }

  function load(idKey, options) {
    return (req, res, next) => {
      lib.ticket.getById(req.params[idKey], options)
        .then(ticket => {
          if (!ticket) {
            return send404Error('Ticket not found', res);
          }

          req.ticket = ticket;
          next();
        })
        .catch(err => send500Error('Failed to load ticket', err, res));
    };
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
      description,
      attachments
    } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!demandType) {
      return send400Error('demandType is required', res);
    }

    if (!description) {
      return send400Error('description is required', res);
    }

    if (attachments && (!Array.isArray(attachments) || !validateObjectIds(attachments))) {
      return send400Error('Attachments are invalid', res);
    }

    return _validateTicketBasicInfo(req, res, next);
  }

  function validateTicketUpdate(req, res, next) {
    if (!req.query.action) {
      return composableMw(
        _validateTicketBasicInfo,
        _validateTicketRequester,
        _validateTicketSupportManager,
        _validateTicketSupportTechnicians
       )(req, res, next);
    }

    if (Object.values(TICKET_ACTIONS).indexOf(req.query.action) === -1) {
      return send400Error(`Action ${req.query.action} is not supported`, res);
    }

    if (req.query.action === TICKET_ACTIONS.updateState) {
      return _validateTicketState(req, res, next);
    }

    if (Object.values(lib.constants.TICKET_SETTABLE_TIMES).indexOf(req.query.field) === -1) {
      return send400Error(`Field ${req.query.field} is not settable`, res);
    }

    if (req.query.action === TICKET_ACTIONS.set && req.ticket.times && req.ticket.times[req.query.field]) {
      return send400Error(`Field ${req.query.field} already set`, res);
    }

    next();
  }

  function _validateTicketBasicInfo(req, res, next) {
    const {
      title,
      demandType,
      severity,
      software,
      description,
      environment,
      requester,
      supportManager,
      type
    } = req.body;
    const contract = req.contract || req.ticket.contract;

    delete req.body.times; // remove if user force to send times

    if ('title' in req.body && !title) {
      return send400Error('title is required', res);
    }

    if ('demandType' in req.body && !demandType) {
      return send400Error('demandType is required', res);
    }

    if ('description' in req.body && !description) {
      return send400Error('description is required', res);
    }

    if ('requester' in req.body && !requester) {
      return send400Error('requester is required', res);
    }

    if ('supportManager' in req.body && !supportManager) {
      return send400Error('supportManager is required', res);
    }

    if (description && (typeof description !== 'string' || description.length < 50)) {
      return send400Error('description must be a string with minimum length of 50', res);
    }

    if (environment && typeof environment !== 'string') {
      return send400Error('environment must be a string', res);
    }

    if (software && !_.isEmpty(software)) {
      if (!software.template || !software.version || !software.criticality) {
        return send400Error('software is invalid: template, version and criticality are required', res);
      }

      if (!_validateSoftware(software, contract.software)) {
        return send400Error('The pair (software template, software version) is not supported', res);
      }
    }

    if (type && type.length) {
      if (type.toLowerCase() !== 'information' && (!software || _.isEmpty(software))) {
        return send400Error('The software is required', res);
      }

      if (type.toLowerCase() !== 'information' && (!severity || !severity.length)) {
        return send400Error('Severity is required', res);
      }
    }

    if (req.contract) {
      const demandSLA = _getDemandFromContract(contract, {
        demandType: demandType,
        severity: severity,
        softwareCriticality: software && software.criticality
      });

      if (!demandSLA) {
        return send400Error('The triple (demandType, severity, software criticality) is not supported', res);
      }

      req.contractTimes = {
        responseSLA: demandSLA.responseTime,
        workaroundSLA: demandSLA.workaroundTime,
        correctionSLA: demandSLA.correctionTime
      };

      return next();
    }

    if (req.ticket) {
      if (req.body.demandType !== req.ticket.demandType ||
          req.body.severity !== req.ticket.severity ||
          !_compareSoftwareCriticality(req.ticket.software, req.body.software)
      ) {
        const demandSLA = _getDemandFromContract(contract, {
          demandType: demandType || req.ticket.demandType,
          severity: severity || req.ticket.severity,
          softwareCriticality: (software && software.criticality) || (req.ticket.software && req.ticket.software.criticality)
        });

        if (!demandSLA) {
          return send400Error('The triple (demandType, severity, software criticality) is not supported', res);
        }
        req.contractTimes = Object.assign({}, req.ticket.times, {
          responseSLA: demandSLA.responseTime,
          workaroundSLA: demandSLA.workaroundTime,
          correctionSLA: demandSLA.correctionTime
        });

        return next();
      }

      next();
    }
  }

  function _validateTicketState(req, res, next) {
    const { state } = req.body;

    if (!state) {
      return send400Error('state is required', res);
    }

    if (!lib.helpers.validateTicketState(state)) {
      return send400Error('state is invalid', res);
    }

    if (req.ticket.state !== lib.constants.TICKET_STATUS.NEW && state === lib.constants.TICKET_STATUS.NEW) {
      return send400Error('change state of ticket to New is not supported', res);
    }

    next();
  }

  function _validateTicketRequester(req, res, next) {
    const { requester } = req.body;

    if (!requester) {
      return next();
    }

    if (!validateObjectIds(requester)) {
      return send400Error('requester is invalid', res);
    }

    lib.user.getById(requester)
      .then(user => {
        if (!user) {
          return send400Error('requester not found', res);
        }

        if (req.ticket && String(requester) !== String(req.ticket.requester._id)) {
          req.changeset = req.changeset || [];
          req.changeset.push({
            key: 'requester',
            displayName: 'requester',
            from: buildUserDisplayName(req.ticket.requester),
            to: buildUserDisplayName(user)
          });
        }

        next();
      })
      .catch(err => send500Error('Unable to check requester', err, res));
  }

  function _validateTicketSupportManager(req, res, next) {
    const { supportManager } = req.body;

    if (!supportManager) {
      return next();
    }

    if (!validateObjectIds(supportManager)) {
      return send400Error('supportManager is invalid', res);
    }

    lib.user.getById(supportManager)
      .then(user => {
        if (!user) {
          return send400Error('supportManager not found', res);
        }

        if (req.ticket && String(supportManager) !== String(req.ticket.supportManager._id)) {
          req.changeset = req.changeset || [];
          req.changeset.push({
            key: 'supportManager',
            displayName: 'support manager',
            from: buildUserDisplayName(req.ticket.supportManager),
            to: buildUserDisplayName(user)
          });
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

          const buildUserDisplayNames = users => users.map(user => buildUserDisplayName(user));

          if (req.ticket) {
            const currentSupportTechnicians = req.ticket.supportTechnicians.map(supportTechnician => String(supportTechnician._id));

            if ((currentSupportTechnicians.length !== supportTechnicians.length) || ((new Set([...currentSupportTechnicians, ...supportTechnicians])).size !== supportTechnicians.length)) {
              req.changeset = req.changeset || [];
              req.changeset.push({
                key: 'supportTechnicians',
                displayName: 'support engineers',
                from: buildUserDisplayNames(req.ticket.supportTechnicians).join(', '),
                to: buildUserDisplayNames(users).join(', ')
              });
            }
          }

          next();
        })
        .catch(err => send500Error('Unable to check supportTechnicians', err, res));
    }

    next();
  }

  function _validateSoftware(software, availableSoftware) {
    return availableSoftware.some(item => (String(item.template._id || item.template) === String(software.template)) &&
                                          (item.versions.indexOf(software.version) > -1) &&
                                          (item.type === software.criticality));
  }

  function _compareSoftwareCriticality(source, target) {
    if (!source && target) return !!target.criticality;
    if (source && !target) return !!source.criticality;
    if (source && target) return source.criticality === target.criticality;

    return true;
  }

  function _getDemandFromContract(contract, options) {
    if (!contract || !contract.demands || contract.demands.length === 0) {
      return;
    }

    return contract.demands.find(demand =>
      demand.demandType === options.demandType &&
      demand.issueType === options.severity &&
      demand.softwareType === options.softwareCriticality
    );
  }
};
