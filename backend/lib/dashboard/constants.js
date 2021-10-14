'use strict';

const { REQUEST_TYPE, TICKET_STATUS, SOFTWARE_CRITICAL, TICKETING_USER_TYPES, SEVERITY_TYPE } = require('../constants');

module.exports = function() {

  function otherType() {
    return {
      $and: [
        { $ne: ['$type', REQUEST_TYPE.ANOMALY] },
        { $ne: ['$type', REQUEST_TYPE.INFORMATION] },
        { $ne: ['$type', REQUEST_TYPE.ADMINISTRATION] }
      ]
    };
  }

  return {
    GROUP: {
      NONE: 'none',
      YEAR: 'year',
      QUARTER: 'quarter',
      MONTH: 'month',
      WEEK: 'week',
      DAY: 'day'
    },
    DASHBOARD_QUERIES: [
      {
        _id: 'globalStats',
        finalStages: [
          {
            $group: {
              _id: null,
              totalTickets: { $sum: {$cond: { if: { $ne: ['$archived', true] }, then: 1, else: 0 }} },
              openTickets: { $sum: { $cond: { if: {$and: [{$ne: ['$status', TICKET_STATUS.CLOSED]}, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}},
              closedTickets: { $sum: { $cond: { if: {$and: [{$eq: ['$status', TICKET_STATUS.CLOSED]}, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}},
              supportAssignedTickets: { $sum: { $cond: { if: {$and: [{$eq: ['$assignedTo.type', TICKETING_USER_TYPES.EXPERT]}, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}},
              criticalTickets: { $sum: { $cond: { if: {$and: [{$eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}},
              notCriticalTickets: { $sum: { $cond: { if: {$and: [{$ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}}
            }
          }
        ]
      },
      {
        _id: 'ticketByOpenClosed',
        middleStages:
        [
          {
            $project: {
              creationDate: '$timestamps.createdAt',
              archived: '$archived',
              closedEvent: {
                $filter: {
                  input: '$events',
                  as: 'event',
                  cond: {$eq: ['$$event.status', 'closed']}
                }
              }
            }
          },
          {
            $project: {
              createdEvent: [
                {
                  status: {$literal: 'created'},
                  archived: '$archived',
                  eventDate: '$creationDate'
                }
              ],
              closedEvent: {
                status: {$literal: 'closed'},
                archived: '$archived',
                eventDate: {$arrayElemAt: ['$closedEvent.timestamps.createdAt', 0]}
              }
            }
          },
          {
            $project: {
              events: {$concatArrays: ['$createdEvent', '$closedEvent']}
            }
          },
          {
            $unwind: '$events'
          },
          {
            $project: {
              archived: '$events.archived',
              timestamps: { createdAt: '$events.eventDate' },
              status: '$events.status'
            }
          }
        ],
        group: {
          open: { $sum: {$cond: { if: {$and: [{ $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}},
          closed: { $sum: {$cond: { if: {$and: [{ $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true]}]}, then: 1, else: 0 }}}
        }
      },
      {
        _id: 'ticketByType',
        finalStages: [
          {
            $group: {
              _id: null,
              anomalyCritical: {
                $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, {$eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              anomalyNonCritical: {
                $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, {$ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              informationCritical: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              informationNonCritical: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              administrationCritical: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              administrationNonCritical: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              otherCritical: {
                $sum: {$cond: { if: { $and: [otherType(), { $eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              otherNonCritical: {
                $sum: {$cond: { if: { $and: [otherType(), { $ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL]}, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              }
            }
          },
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
            $match: {
              $and: [
                { 'software.software': { $exists: true }},
                { status: { $ne: ['$status', TICKET_STATUS.CLOSED] }},
                { archived: { $ne: ['$archived', true]} }
              ]
            }
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
                $sum: {$cond: { if: otherType(), then: 1, else: 0 }}
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
            $match: {
              $and: [
                { 'software.software': { $exists: true } },
                { archived: { $ne: ['$archived', true]} }
              ]
            }
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
      },
      {
        _id: 'ticketVolumeByType',
        finalStages: [
          {
            $group: {
              _id: null,
              anomalyOpen: {
                $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, { $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              anomalyClosed: {
                $sum: { $cond: { if: {$and: [{$eq: ['$type', REQUEST_TYPE.ANOMALY]}, { $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              informationOpen: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              informationClosed: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.INFORMATION] }, { $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              administrationOpen: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              administrationClosed: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.ADMINISTRATION] }, { $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              vulnerabilityOpen: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.VULNERABILITY] }, { $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              vulnerabilityClosed: {
                $sum: {$cond: { if: { $and: [{ $eq: ['$type', REQUEST_TYPE.VULNERABILITY] }, { $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              otherOpen: {
                $sum: {$cond: { if: { $and: [otherType(), { $ne: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              },
              otherClosed: {
                $sum: {$cond: { if: { $and: [otherType(), { $eq: ['$status', TICKET_STATUS.CLOSED] }, {$ne: ['$archived', true] }] }, then: 1, else: 0 }}
              }
            }
          },
          {
            $project: {
              _id: 0,
              anomaly: {
                total: {$sum: ['$anomalyOpen', '$anomalyClosed']},
                open: '$anomalyOpen',
                closed: '$anomalyClosed'
              },
              information: {
                total: {$sum: ['$informationOpen', '$informationClosed']},
                open: '$informationOpen',
                closed: '$informationClosed'
              },
              administration: {
                total: {$sum: ['$administrationOpen', '$administrationClosed']},
                open: '$administrationOpen',
                closed: '$administrationClosed'
              },
              vulnerability: {
                total: {$sum: ['$vulnerabilityOpen', '$vulnerabilityClosed']},
                open: '$vulnerabilityOpen',
                closed: '$vulnerabilityClosed'
              },
              other: {
                total: {$sum: ['$otherOpen', '$otherClosed']},
                open: '$otherOpen',
                closed: '$otherClosed'
              }
            }
          }
        ]
      },
      {
        _id: 'ticketPriorityAnomalies',
        finalStages: [
          {
            $match: {
              type: REQUEST_TYPE.ANOMALY,
              archived: { $ne: true }
            }
          },
          {
            $group: {
              _id: null,
              blockingCritical: {
                $sum: { $cond: { if: {$and: [{$eq: ['$severity', SEVERITY_TYPE.BLOCKING]}, { $eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL] }] }, then: 1, else: 0 }}
              },
              blockingNotCritical: {
                $sum: { $cond: { if: {$and: [{$eq: ['$severity', SEVERITY_TYPE.BLOCKING]}, { $ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL] }] }, then: 1, else: 0 }}
              },
              noBlockingCritical: {
                $sum: {$cond: { if: { $and: [{ $ne: ['$severity', SEVERITY_TYPE.BLOCKING] }, { $eq: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL] }] }, then: 1, else: 0 }}
              },
              noBlockingNotCritical: {
                $sum: {$cond: { if: { $and: [{ $ne: ['$severity', SEVERITY_TYPE.BLOCKING] }, { $ne: ['$software.critical', SOFTWARE_CRITICAL.CRITICAL] }] }, then: 1, else: 0 }}
              }
            }
          },
          {
            $project: {
              _id: 0,
              blocking: {
                total: {$sum: ['$blockingCritical', '$blockingNotCritical']},
                blockingCritical: '$blockingCritical',
                blockingNotCritical: '$blockingNotCritical'
              },
              noBlocking: {
                total: {$sum: ['$noBlockingCritical', '$noBlockingNotCritical']},
                blockingCritical: '$noBlockingCritical',
                blockingNotCritical: '$noBlockingNotCritical'
              }
            }
          }
        ]
      }
    ]
  };
};
