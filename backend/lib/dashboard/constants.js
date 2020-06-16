'use strict';

const { REQUEST_TYPE, TICKET_STATUS, TICKET_SEVERITY } = require('../constants');

module.exports = {
  GROUP: {
    NONE: 'none',
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day'
  },
  DASHBOARD_QUERIES: [
    {
      _id: 'ticketByOpenClosed',
      group: {
        open: { $sum: {$cond: { if: { $ne: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}},
        closed: { $sum: {$cond: { if: { $eq: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}}
      }
    },
    {
      _id: 'ticketByType',
      group: {
        anomalyCritical: {
          $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, {$eq: ['$severity', TICKET_SEVERITY.CRITICAL]}]}, then: 1, else: 0 }}
        },
        anomalyNonCritical: {
          $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, {$ne: ['$severity', TICKET_SEVERITY.CRITICAL]}]}, then: 1, else: 0 }}
        },
        informationCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $eq: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        },
        informationNonCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $ne: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        },
        administrationCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $eq: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        },
        administrationNonCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $ne: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        },
        otherCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.OTHER] }, { $eq: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        },
        otherNonCritical: {
            $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.OTHER] }, { $ne: ['$severity', TICKET_SEVERITY.CRITICAL] }] }, then: 1, else: 0 }}
        }
      },
      finalStages: [
        {
          $project: {
            _id: '$_id',
            anomaly: {
              total: {$sum: ['$anomalyCritical', '$anomalyNonCritical']},
              critical: '$anomalyCritical',
              nonCritical: '$anomalyNonCritical'
            },
            information: {
              total: { $sum: ['$informationCritical', '$informationNonCritical'] },
              critical: '$informationCritical',
              nonCritical: '$informationNonCritical'
            },
            administration: {
              total: { $sum: ['$administrationCritical', '$administrationNonCritical'] },
              critical: '$administrationCritical',
              nonCritical: '$administrationNonCritical'
            },
            other: {
              total: { $sum: ['$otherCritical', '$otherNonCritical'] },
              critical: '$otherCritical',
              nonCritical: '$otherNonCritical'
            }
          }
        }
      ]
    }
  ]
};
