const { TICKETING_USER_TYPES } = require('../constants');

module.exports = {
  FILTER_LIST: [
    {
      _id: 'mytickets',
      name: 'My tickets',
      query: {
        $and: [
          {'author.id': { $eq: '%user%' } },
          { archived: { $ne: true } }
        ]
      }
    },
    {
      _id: 'myunsolvedtickets',
      name: 'My unsolved tickets',
      query: {
        $or: [
          { 'assignedTo._id': { $eq: '%user%' } },
          { 'responsible._id': { $eq: '%user%' } }
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
      _id: 'open',
      name: 'Open tickets',
      query: { status: { $ne: 'closed' }, archived: { $ne: true }}
    },
    {
      _id: 'suspended',
      name: 'Suspended tickets',
      query: { 'assignedTo.type': 'beneficiary', archived: { $ne: true } }
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
      _id: 'archived',
      name: 'Archived tickets',
      query: { archived: true },
      rights: [TICKETING_USER_TYPES.EXPERT]
    }
  ],
  RECENTLY: 86400000, // 24 hours,
  WEEK: 86400000 * 7
};
