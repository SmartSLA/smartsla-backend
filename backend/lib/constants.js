'use strict';

module.exports = {
  TICKETING_USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    USER: 'user'
  },
  DEFAULT_LIST_OPTIONS: {
    OFFSET: 0,
    LIMIT: 50
  },
  ORDER_TYPES: ['USP', 'USPL', 'USL'],
  GLOSSARY_CATEGORIES: {
    DEMAND_TYPE: 'Demand type',
    SOFTWARE_TYPE: 'Software type',
    ISSUE_TYPE: 'Issue type'
  },
  INDICES: {
    ORGANIZATION: {
      name: 'organizations.idx',
      type: 'organizations'
    },
    SOFTWARE: {
      name: 'software.idx',
      type: 'software'
    }
  },
  EVENTS: {
    ORGANIZATION: {
      created: 'ticketing:organization:created',
      updated: 'ticketing:organization:updated'
    },
    SOFTWARE: {
      created: 'ticketing:software:created',
      updated: 'ticketing:software:updated'
    }
  }
};
