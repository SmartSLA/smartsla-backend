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
    }
  ]
};
