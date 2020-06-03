'use strict';

const { REQUEST_TYPE, TICKET_STATUS } = require('../constants');

module.exports = {
  GROUP: {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day'
  },
  DASHBOARD_QUERIES: [
    {
      _id: 'ticketByType',
      group: {
        anomaly: { $sum: {$cond: { if: { $eq: ['$type', REQUEST_TYPE.ANOMALY] }, then: 1, else: 0 }}},
        information: { $sum: {$cond: { if: { $eq: ['$type', REQUEST_TYPE.INFORMATION] }, then: 1, else: 0 }}},
        administration: { $sum: {$cond: { if: { $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, then: 1, else: 0 }}},
        other: { $sum: {$cond: { if: { $eq: ['$type', REQUEST_TYPE.OTHER] }, then: 1, else: 0 }}}
      }
    },
    {
      _id: 'ticketByOpenClosed',
      group: {
        open: { $sum: {$cond: { if: { $ne: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}},
        closed: { $sum: {$cond: { if: { $eq: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}}
      }
    }
  ]
};
