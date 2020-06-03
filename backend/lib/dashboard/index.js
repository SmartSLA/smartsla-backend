'use strict';

const moment = require('moment-timezone');

const { DASHBOARD_QUERIES, GROUP } = require('./constants');
const { ALL_CONTRACTS } = require('../constants');

module.exports = dependencies => {
  const contract = require('../contract')(dependencies);
  const mongoose = dependencies('db').mongo.mongoose;
  const Ticket = mongoose.model('Ticket');

  return {
    processDashboardQuery
  };

  function processDashboardQuery({ user, ticketingUser, query }) {
    const dashboardQuery = DASHBOARD_QUERIES.find(dashboardQuery => dashboardQuery._id === query.queryId);
    const dateField = 'timestamps.createdAt';
    const start = (query.start && moment.utc(query.start)) || moment().add(-1, 'years');
    const end = (query.end && moment.utc(query.end)) || moment();
    const group = query.group || GROUP.MONTH;
    let groupConditionId = {};

    switch (group) {
      case GROUP.DAY:
        groupConditionId = { day: {$dayOfMonth: '$' + dateField }};
      // eslint-disable-next-line no-fallthrough
      case GROUP.MONTH:
        groupConditionId = { month: { $month: '$' + dateField }, ...groupConditionId };
      // eslint-disable-next-line no-fallthrough
      case GROUP.YEAR:
        groupConditionId = { year: { $year: '$' + dateField }, ...groupConditionId };
    }

    const groupCondition = { _id: groupConditionId, ...dashboardQuery.group };

    let matchCondition = { [dateField]: { $gte: start.toISOString(), $lte: end.toISOString() }};

    return contract.allowedContracts({ user, ticketingUser })
      .then(contracts => {
        if (contracts && contracts !== ALL_CONTRACTS) {
          matchCondition = { ...matchCondition, contract: { $in: contracts }};
        }

        const pipeline = [];

        pipeline.push({ $match: matchCondition });
        pipeline.push({ $sort: { [dateField]: 1 } });
        pipeline.push({ $group: groupCondition});

        return Ticket.aggregate(pipeline);
      });
  }
};
