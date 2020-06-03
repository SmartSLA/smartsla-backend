'use strict';

module.exports = {
  FILTER_LIST: [
    {
      _id: 'closed',
      name: 'Closed tickets',
      query: { status: 'closed' }
    },
    {
      _id: 'open',
      name: 'Open tickets',
      query: { status: { $ne: 'closed' }}
    },
    {
      _id: 'unassigned',
      name: 'Unassigned tickets',
      query: { assignedTo: { $exists: false }}
    },
    {
      _id: 'suspended',
      name: 'Suspended tickets',
      query: { 'assignedTo.type': 'beneficiary' }
    },
    {
      _id: 'recentlyupdated',
      name: 'Recently updated tickets',
      query: { 'timestamps.updatedAt': { $gt: '%recent_date%' } }
    },
    {
      _id: 'recentlysolved',
      name: 'Recently solved tickets',
      query: { 'timestamps.updatedAt': { $gt: '%recent_date%' }, status: { $in: ['resolved', 'closed']} }
    },
    {
      _id: 'mytickets',
      name: 'Your tickets',
      query: { 'author.id': { $eq: '%user%'} }
    },
    {
      _id: 'myunsolvedtickets',
      name: 'Your unsolved tickets',
      query: {
        $or: [
          { 'assignedTo._id': { $eq: '%user%' } },
          { 'responsible._id': { $eq: '%user%' } }
        ],
        status: { $ne: 'closed'}
      }
    }
  ],
  RECENTLY: 86400000 // 24 hours
};
