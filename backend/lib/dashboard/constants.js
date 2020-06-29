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
      _id: 'globalStats',

      finalStages: [
        {
          $group: {
            _id: null,
            openTickets: { $sum: {$cond: { if: { $ne: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}},
            closedTickets: { $sum: {$cond: { if: { $eq: ['$status', TICKET_STATUS.CLOSED] }, then: 1, else: 0 }}},
            activeContracts: { $addToSet: '$contract' },
            criticalTickets: { $sum: {$cond: { if: { $eq: ['$severity', TICKET_SEVERITY.CRITICAL] }, then: 1, else: 0 }}}
          }
        },
        {
          $project: {
            _id: '$_id',
            openTickets: '$openTickets',
            closedTickets: '$closedTickets',
            criticalTickets: '$criticalTickets',
            activeContracts: { $size: '$activeContracts' }
          }
        }
      ]
    },
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
    },
    {
      _id: 'topSoftware',
      finalStages: [
        {
          $match: { 'software.software': { $exists: true }, status: { $ne: ['$status', TICKET_STATUS.CLOSED] } }
        },
        {
          $group: {
            _id: '$software.software',
            total: { $sum: 1 },
            anomaly: {
              $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}]}, then: 1, else: 0 }}
            },
            information: {
              $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }] }, then: 1, else: 0 }}
            },
            administration: {
              $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }] }, then: 1, else: 0 }}
            },
            other: {
              $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.OTHER] }] }, then: 1, else: 0 }}
            }
          }
        },
        {
          $lookup: {
            from: 'softwares',
            localField: '_id',
            foreignField: '_id',
            as: 'software'
          }
        },
        {
          $unwind: '$software'
        },
        {
          $project: {
            _id: 0,
            softwareName: '$software.name',
            total: 1,
            anomaly: 1,
            information: 1,
            administration: 1,
            other: 1
          }
        },
        {
          $sort: {
            total: -1
          }
        }
      ]
    },
    {
      _id: 'OpenTicketsBySoftware',
      finalStages: [
        {
          $match: { 'software.software': { $exists: true } }
        },
        {
          $group: {
            _id: '$software.software',
            ticketCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'softwares',
            localField: '_id',
            foreignField: '_id',
            as: 'software'
          }
        },
        {
          $unwind: '$software'
        },
        {
          $project: {
            _id: 0,
            softwareName: '$software.name',
            ticketCount: 1
          }
        }
      ]
    }
  ]
};
