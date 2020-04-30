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
      query: { status: { $neq: 'closed' }}
    }
  ]
};
