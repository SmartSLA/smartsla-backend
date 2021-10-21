'use strict';

module.exports = function(dependencies, lib) {
  const EsnConfig = dependencies('esn-config').EsnConfig;
  const ticketMiddlewares = require('../ticket/middleware')(dependencies, lib);
  const { LININFOSEC_SEVERITY_TYPES, LININFOSEC } = require('../constants');
  const { send500Error, send403Error } = require('../utils')(dependencies);
  const i18n = require('../../../lib/i18n/index.js')(dependencies);
  const logger = dependencies('logger');

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
  async function create(req, res) {
    const notifications = req.body;

    if (!notifications || notifications.length === 0) {
      logger.error('Notification array messing or empty');

      return res.status(400).json('Notification is required');
    }
    logger.info('Creating ticket...');
    const CVEMap = new Map([]);

    notifications.forEach(notif => {
      let cves;

      CVEMap.has(notif.configurationUid) ?
        (cves = CVEMap.get(notif.configurationUid)) :
        cves = [];

      cves.push(notif.cve);
      CVEMap.set(notif.configurationUid, cves);
    });

    // eslint-disable-next-line
    let author = await _getAuthor();
    let tickets = [];

    for (const [confUid, cves] of CVEMap) {
      const contract = await _getContract(confUid);

      if (!contract.isLininfosecEnabled) {
        return send403Error('Can not create a ticket: LinInfoSec is disabled for this contract', res);
      }

      const normalizedCveTickets = [];

      for (const cve of cves) {
        normalizedCveTickets.push(_normalizeTicket(cve, contract, author));
      }
      tickets = [...tickets, ...normalizedCveTickets];
    }
    for (const ticket of tickets) {
      ticketMiddlewares.transform(ticket).then(newTicket => {
        lib.ticket.create(newTicket)
          .then(createdTicket => logger.info(`Ticket ${createdTicket.title} created succesfully`))
          .catch(err => `Failled to create CVE ticket with error ${err.message}`);
      })
        .catch(err => `Failled to create CVE ticket with error ${err.message}`);
    }

    return res.status(200).json('All done !!');

    function _normalizeTicket(notification, contract, author) {

      const isVersionIncluding = (cpe, start) => {
        const keys = Object.getOwnPropertyNames(cpe);

        for (const idx of keys) {
          if (idx.includes('versionStart') && start) {
            return idx.includes('Including') ? { including: true, version: cpe.versionStartIncluding } : { including: true, version: cpe.versionStartExcluding };
          } else if (idx.includes('versionEnd') && !start) {
            return idx.includes('Including') ? { including: true, version: cpe.versionEndIncluding } : { including: true, version: cpe.versionEndExcluding };
          }

          return null;
        }
      };

      let cpes = [];

      if (notification.configurations.nodes[0].cpe_match && notification.configurations.nodes[0].cpe_match.length > 0) {
        cpes = notification.configurations.nodes[0].cpe_match.map(cpe => (
          {
            cpe23Uri: cpe.cpe23Uri,
            versionStart: isVersionIncluding(cpe, true),
            versionEnd: isVersionIncluding(cpe, false)
          }
        ));
      }

      let references = [];

      if (notification.cve.references.reference_data && notification.cve.references.reference_data.length > 0) {
        references = notification.cve.references.reference_data.map(ref => (
          {
            URL: { url: ref.url, name: ref.name },
            source: ref.refsource,
            tags: ref.tags
          }));
      }

      return {
        contract: contract.contractUid,
        type: LININFOSEC.TYPE,
        severity: _getSeverity(notification.impact.baseMetricV2.severity),
        description: notification.cve.description.description_data[0].value,
        status: LININFOSEC.TICKET_STATUS,
        callNumber: LININFOSEC.DEFAULT_CALLNUMBER,
        meetingId: LININFOSEC.DEFAULT_MEETINGID,
        title: i18n.__('Vulnerability detected: {{CveId}} on {{softwareName}} v-{{softwareVersion}}',
          {
            CveId: notification.cve.CVE_data_meta.ID,
            softwareName: contract.contractSoftware.software.name,
            softwareVersion: contract.contractSoftware.version
          }),
        author: author,
        software: contract.contractSoftware,
        participants: contract.vulnerabilityMailingList ? [contract.vulnerabilityMailingList] : [],
        vulnInfos: { cpes, references }
      };
    }

    function _getAuthor() {
      return new EsnConfig('smartsla-backend').get('lininfosec')
        .then(lininfosec => (lininfosec.author))
        .catch(err => send500Error('Failed to get the author', err, res));
    }

    function _getContract(configurationUid) {
      const [contractUid, softwareUid] = configurationUid.split('-');

      return lib.contract.getById(contractUid)
        .then(contract => (contract.toObject()))
        .then(contract => {
          const contractSoftware = contract.software.filter(software => software._id.toString() === softwareUid)[0],
            vulnerabilityMailingList = contract.mailingList.vulnerability;

          return {
            contractUid,
            isLininfosecEnabled: contract.features.linInfoSec,
            contractSoftware,
            vulnerabilityMailingList
          };
        })
        .catch(err => {
          logger.error('Error while fetching contract: ' + err);

          return err;
        });
    }

    function _getSeverity(notificationSeverity) {
      let severity = '';

      switch (notificationSeverity) {
        case 'HIGH':
          severity = LININFOSEC_SEVERITY_TYPES.MAJOR;
          break;
        case 'MEDIUM':
        case 'LOW':
          severity = LININFOSEC_SEVERITY_TYPES.MINOR;
          break;
        default:
          severity = LININFOSEC_SEVERITY_TYPES.NONE;
      }

      return severity;
    }
  }
};
