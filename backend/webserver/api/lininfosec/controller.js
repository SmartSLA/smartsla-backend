'use strict';

module.exports = function(dependencies, lib) {
  const EsnConfig = dependencies('esn-config').EsnConfig;
  const ticketMiddlewares = require('../ticket/middleware')(dependencies, lib);
  const { SEVERITY_TYPES, LININFOSEC } = require('../constants');
  const { send500Error } = require('../utils')(dependencies);

  return {
    create
  };

  /**
   * Create a ticket when LinInfoSec detects a CVE affecting
   *
   * req.body contains the vulnerability notification sent by LinInfoSec when a CVE hits one of a software configuration which lead to the automatic creation of a ticket
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    const notification = req.body;

    if (!notification) {
      return res.status(500).json('Notification is required');
    }

    return _normalizeTicket(notification, res).then(ticket => {
      lib.ticket.create(ticket).then(createdTicket => {
        res.status(201).json(createdTicket);
      })
      .catch(err => send500Error('Failed to create ticket', err, res));
    });

    function _normalizeTicket(notification) {
      const ticket = {
        title: notification.cve.CVE_data_meta.ID,
        contract: notification.configurationUid.split('-')[0],
        participants: [],
        type: LININFOSEC.TYPE,
        severity: _getSeverity(notification.impact.baseMetricV2.severity),
        description: notification.cve.description.description_data[0].value,
        status: 'new',
        callNumber: LININFOSEC.DEFAULT_CALLNUMBER,
        meetingId: LININFOSEC.DEFAULT_MEETINGID
      };

      return Promise.all([
        _getAuthor(),
        _getContractSoftware(notification.configurationUid.split('-')[0])
      ])
      .then(([author, software]) => ({
        ...ticket,
        author: author,
        software: software
      }))
      .then(normalizedTicket => (ticketMiddlewares.transform(normalizedTicket, res)))
      .then(newTicket => newTicket)
      .catch(err => send500Error('Failed to create ticket', err, res));
    }

    function _getAuthor() {
      return new EsnConfig('smartsla-backend').get('lininfosec')
      .then(lininfosec => (lininfosec.author))
      .catch(err => send500Error('Failed to get the author', err, res));
    }

    function _getContractSoftware(contractId) {
      return lib.contract.getById(contractId).then(
        contractSoftware => (contractSoftware.toObject().software.filter(software => software._id.toString() === notification.configurationUid.split('-')[1])[0])
      );
    }

    function _getSeverity(notificationSeverity) {
      let severity = '';

      switch (notificationSeverity) {
        case 'HIGH':
        case 'MEDIUM':
          severity = SEVERITY_TYPES.MAJOR;
          break;
        case 'LOW':
          severity = SEVERITY_TYPES.MINOR;
          break;
        default:
          severity = SEVERITY_TYPES.NONE;
      }

      return severity;
    }
  }
};
