const { TICKETING_USER_TYPES } = require('../constants');

module.exports = {
  FILTER_LIST: [
    {
      _id: 'open',
      name: 'Open tickets',
      query: {
        status: { $ne: 'closed' },
        type: { $ne: 'softwareVulnerability' },
        archived: { $ne: true }}
    },
    {
      _id: 'closed',
      name: 'Closed tickets',
      query: {
        status: 'closed',
        archived: { $ne: true }
      }
    },
    {
      _id: 'all',
      name: 'All tickets',
      query: { archived: { $ne: true }}
    },
    {
      _id: 'mytickets',
      name: 'My tickets',
      query: {
        $or: [
          { 'author.id': { $eq: '%user%' } },
          { 'assignedTo.id': { $eq: '%user%' } }
        ],
        archived: { $ne: true }
      },
      rights: [TICKETING_USER_TYPES.BENEFICIARY]
    },
    {
      _id: 'myassignedtickets',
      name: 'My assigned tickets',
      query: {
        $and: [
          { 'assignedTo.id': { $eq: '%user%' } },
          { archived: { $ne: true } }
        ]
      },
      rights: [TICKETING_USER_TYPES.EXPERT]
    },
    {
      _id: 'myaccountabletickets',
      name: 'My accountable tickets',
      query: {
        $and: [
          { 'responsible.id': { $eq: '%user%' } },
          { archived: { $ne: true } }
        ]
      },
      rights: [TICKETING_USER_TYPES.EXPERT]
    },
    {
      _id: 'myunsolvedtickets',
      name: 'My unsolved tickets',
      query: {
        $or: [
          { 'assignedTo.id': { $eq: '%user%' } },
          { 'responsible.id': { $eq: '%user%' } }
        ],
        status: { $ne: 'closed' },
        archived: { $ne: true }
      }
    },
    {
      _id: 'unassigned',
      name: 'Unassigned tickets',
      query: {
        assignedTo: { $exists: false },
        archived: { $ne: true }
      }
    },
    {
      _id: 'recentlyupdated',
      name: 'Recently updated tickets',
      query: {
        'timestamps.updatedAt': { $gt: '%recent_date%' },
        type: { $ne: 'softwareVulnerability' },
        archived: { $ne: true }
      }
    },
    {
      _id: 'notupdatedweekago',
      name: 'Not updated tickets since one week',
      rights: [TICKETING_USER_TYPES.EXPERT],
      query: {
        'timestamps.updatedAt': { $lt: '%one_week_ago%' },
        status: { $ne: 'closed' },
        type: { $ne: 'softwareVulnerability' },
        archived: { $ne: true }
      }
    },
    {
      _id: 'recentlysolved',
      name: 'Recently solved tickets',
      query: {
        'timestamps.updatedAt': { $gt: '%recent_date%' },
        status: { $in: ['resolved', 'closed'] },
        archived: { $ne: true }
      }
    },
    {
      _id: 'suspended',
      name: 'Suspended tickets',
      query: { 'assignedTo.type': 'beneficiary', archived: { $ne: true } }
    },
    {
      _id: 'vulnerability',
      name: 'Vulnerability tickets',
      query: {
        type: 'softwareVulnerability',
        archived: { $ne: true }
      },
      rights: [TICKETING_USER_TYPES.EXPERT]
    },
    {
      _id: 'archived',
      name: 'Archived tickets',
      query: { archived: true },
      rights: [TICKETING_USER_TYPES.EXPERT]
    }
  ],
  RECENTLY: 86400000, // 24 hours,
  WEEK: 86400000 * 7
};
