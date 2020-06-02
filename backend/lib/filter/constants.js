'use strict';

const RECENTLY = 86400000; // 24 hours

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
      query: { 'timestamps.updatedAt': { $gt: new Date(Date.now() - RECENTLY) } }
    },
    {
      _id: 'recentlysolved',
      name: 'Recently solved tickets',
      query: { 'timestamps.updatedAt': { $gt: new Date(Date.now() - RECENTLY) }, status: { $in: ['resolved', 'closed']}}
    }
  ]
};
