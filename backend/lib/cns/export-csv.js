const moment = require('moment-timezone');
const { capitalize } = require('lodash');
const htmlToText = require('html-to-text');

module.exports = function(dependencies) {
  const i18n = require('../i18n')(dependencies);
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');

  moment.locale(i18n.locale);

  return { exportData };

  function exportData(tickets) {
    return Promise.all(tickets.map(ticket =>
      getContract(ticket.contract).then(contract => formatCsvData(ticket, contract)))
    )
    .then(csvData => addLabels(csvData));
  }

  function addLabels(csvData) {
    csvData.unshift({
      [i18n.__('Id')]: i18n.__('Ticket id'),
      [i18n.__('Type')]: i18n.__('Type of request'),
      [i18n.__('Severity')]: i18n.__('Ticket severity'),
      [i18n.__('Software')]: i18n.__('Software supported in ticket'),
      [i18n.__('Version')]: i18n.__('Software version'),
      [i18n.__('OS')]: i18n.__('Software operating system'),
      [i18n.__('Title')]: i18n.__('Ticket title'),
      [i18n.__('Description')]: i18n.__('Ticket description'),
      [i18n.__('Assigned to')]: i18n.__('The person to whom the ticket is assigned'),
      [i18n.__('Created by')]: i18n.__('The person who opened the ticket'),
      [i18n.__('Service (of author)')]: i18n.__('The service to which the author belongs'),
      [i18n.__('Contract')]: i18n.__('Contract supported in the ticket'),
      [i18n.__('Last update')]: i18n.__('The date of the last modification of the ticket'),
      [i18n.__('Created at')]: i18n.__('The date the ticket was created'),
      [i18n.__('Status')]: i18n.__('The progress of the ticket'),
      [i18n.__('SLA support')]: i18n.__('Time spent to support the ticket / Service Level Agreement support'),
      [i18n.__('SLA bypass')]: i18n.__('Time spent to bypass the ticket / Service Level Agreement bypass'),
      [i18n.__('SLA resolution')]: i18n.__('Time spent to resolve the ticket / Service Level Agreement resolution'),
      [i18n.__('BH / NBH')]: i18n.__('Working Hours / Non-Working Hours'),
      [i18n.__('Supt')]: i18n.__('Support Time'),
      [i18n.__('Ctt')]: i18n.__('Bypass Time'),
      [i18n.__('Ctt / Ctt target')]: i18n.__('Percentage of bypass time consumption'),
      [i18n.__('Crt')]: i18n.__('Correction time'),
      [i18n.__('Crt / Crt target')]: i18n.__('Percentage of bypass time correction'),
      [i18n.__('WT')]: i18n.__('Cumulative waiting time')
    });

    return csvData;
  }

  function formatCsvData(ticket, contract) {
    return {
      [i18n.__('Id')]: ticket._id,
      [i18n.__('Type')]: i18n.__(ticket.type),
      [i18n.__('Severity')]: i18n.__(ticket.severity),
      [i18n.__('Software')]: ticket.software && ticket.software.software.name,
      [i18n.__('Version')]: ticket.software && ticket.software.version,
      [i18n.__('OS')]: ticket.software && ticket.software.os,
      [i18n.__('Title')]: ticket.title,
      [i18n.__('Description')]: htmlToText.fromString(ticket.description),
      [i18n.__('Assigned to')]: (ticket.assignedTo && ticket.assignedTo.name) || i18n.__('Not assigned yet'),
      [i18n.__('Created by')]: ticket.author.name,
      [i18n.__('Service (of author)')]: ticket.author.service || 'N/A',
      [i18n.__('Contract')]: contract.name,
      [i18n.__('Last update')]: moment(ticket.timestamps.updatedAt)
        .format('L'),
      [i18n.__('Created at')]: moment(ticket.timestamps.createdAt)
        .format('L'),
      [i18n.__('Status')]: i18n.__(capitalize(ticket.status)),
      [i18n.__('SLA support')]: hasEngagement(ticket.cns.supported) && i18n.__('{{hours}}WH / {{duration}}WH', getRatioInHours(ticket.cns.supported)),
      [i18n.__('SLA bypass')]: hasEngagement(ticket.cns.bypassed) && i18n.__('{{hours}}WH / {{duration}}WH', getRatioInHours(ticket.cns.bypassed)),
      [i18n.__('SLA resolution')]: hasEngagement(ticket.cns.resolved) && i18n.__('{{hours}}WH / {{duration}}WH', getRatioInHours(ticket.cns.resolved)),
      [i18n.__('BH / NBH')]: ticket.createdDuringBusinessHours ? i18n.__('BH') : i18n.__('NBH'),
      [i18n.__('Supt')]: hasEngagement(ticket.cns.supported) && ticket.cns.supported.getEngagementInHours(),
      [i18n.__('Ctt')]: hasEngagement(ticket.cns.bypassed) && ticket.cns.bypassed.getEngagementInHours(),
      [i18n.__('Ctt / Ctt target')]: hasEngagement(ticket.cns.bypassed) && ticket.cns.bypassed.percentageElapsed.toFixed(2),
      [i18n.__('Crt')]: hasEngagement(ticket.cns.resolved) && ticket.cns.resolved.percentageElapsed.toFixed(2),
      [i18n.__('Crt / Crt target')]: hasEngagement(ticket.cns.resolved) && ticket.cns.resolved.percentageElapsed.toFixed(2),
      [i18n.__('WT')]: hasEngagement(ticket.cns.supported) && getWaitingTime(ticket.cns)
    };
  }

  function getContract(contractId) {
    return Contract.findById(contractId).exec();
  }

  function getRatioInHours(cnsValue) {
    return {
      hours: cnsValue ? cnsValue.getValueInHours().toFixed(2) : 0,
      duration: cnsValue ? cnsValue.getEngagementInHours() : 0
    };
  }

  function hasEngagement(cnsValue) {
    return cnsValue && cnsValue.engagement;
  }

  function getWaitingTime(cns) {
    const resolvedSuspendedMinutes = cns.resolved ? cns.resolved.suspendedMinutes : 0;
    const supportedSuspendedMinutes = cns.supported ? cns.supported.suspendedMinutes : 0;

    return ((resolvedSuspendedMinutes + supportedSuspendedMinutes) / 60).toFixed(2);
  }
};
