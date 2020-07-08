'use strict';

const { DASHBOARD_QUERIES, GROUP } = require('./constants');
const { ALL_CONTRACTS } = require('../constants');
const moment = require('moment-timezone');

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

    return contract.allowedContracts({ user, ticketingUser })
      .then(allowedContractIds => {
        const pipeline = [];
        let matchCondition = getDateMatching(query.start, query.end, dateField);
        let contractIdFilter;

        if (allowedContractIds && allowedContractIds !== ALL_CONTRACTS) {
          contractIdFilter = allowedContractIds;
        }

        if (query.contracts) {
          contractIdFilter = contractIdFilter ? query.contracts.filter(contract => contractIdFilter.includes(contract)) : query.contracts;
        }

        if (contractIdFilter) {
          matchCondition = {
            ...matchCondition,
            contract: { $in: contractIdFilter.map(mongoose.Types.ObjectId) }
          };
        }

        if (matchCondition) {
          pipeline.push({ $match: matchCondition });
        }

        if (dashboardQuery.group) {
          const groupCondition = getGrouping(dashboardQuery, query.group, dateField);

          pipeline.push({ $group: groupCondition});
          pipeline.push({ $sort: { _id: 1 } });
        }

        if (dashboardQuery.finalStages) {
          pipeline.push(...dashboardQuery.finalStages);
        }

        return Ticket.aggregate(pipeline);
      });
  }

  function getGrouping(dashboardQuery, queryGroup, dateField) {
    const group = queryGroup || GROUP.MONTH;
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
        break;
      case GROUP.NONE:
        groupConditionId = null;
    }
    const groupCondition = {_id: groupConditionId, ...dashboardQuery.group};

    return groupCondition;
  }

  function getDateMatching(queryStart, queryEnd, dateField) {
    let matchCondition;

    if (queryStart) {
      matchCondition = { $gte: new Date(queryStart) };
    }

    if (queryEnd) {
      const end = moment.utc(queryEnd).add(1, 'days');

      matchCondition = { ...matchCondition || {}, $lte: new Date(end) };
    }

    if (matchCondition) {
      return { [dateField]: matchCondition };
    }
  }
};
