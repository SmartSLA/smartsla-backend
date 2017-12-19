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
  GLOSSARY_CATEGORIES: {
    DEMAND_TYPE: 'Demand type',
    SOFTWARE_TYPE: 'Software type',
    ISSUE_TYPE: 'Issue type'
  },
  TICKET_STATES: {
    NEW: 'New',
    IN_PROGRESS: 'In Progress',
    AWAITING: 'Awaiting',
    AWAITING_INFORMATION: 'Awaiting information',
    AWAITING_VALIDATION: 'Awaiting validation',
    CLOSED: 'Closed',
    ABANDONED: 'Abandoned'
  },
  INDICES: {
    CONTRACT: {
      name: 'contracts.idx',
      type: 'contracts'
    },
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
    CONTRACT: {
      created: 'ticketing:contract:created',
      updated: 'ticketing:contract:updated'
    },
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
