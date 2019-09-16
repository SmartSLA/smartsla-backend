'use strict';

module.exports = {
  EMAIL_NOTIFICATIONS: {
    DEFAULT_FROM: 'ossa@linagora.com',
    DEFAULT_RESPONSIBLE_EMAIL: 'ossa@linagora.com',
    TYPES: {
      CREATED: 'CREATED',
      UPDATED: 'UPDATED'
    }
  },
  TICKETING_USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    USER: 'user',
    SUPPORTER: 'supporter'
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
    IN_PROGRESS: 'In progress',
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
    },
    USER: {
      name: 'ticketing.users.idx',
      type: 'users'
    },
    TEAM: {
      name: 'ticketing.teams.idx',
      type: 'teams'
    },
    CLIENT: {
      name: 'ticketing.clients.idx',
      type: 'clients'
    }
  },
  EVENTS: {
    CONTRACT: {
      created: 'ticketing:contract:created',
      updated: 'ticketing:contract:updated',
      deleted: 'ticketing:contract:deleted'
    },
    ORGANIZATION: {
      created: 'ticketing:organization:created',
      updated: 'ticketing:organization:updated'
    },
    SOFTWARE: {
      created: 'ticketing:software:created',
      updated: 'ticketing:software:updated',
      deleted: 'ticketing:software:deleted'
    },
    TEAM: {
      created: 'ticketing:team:created',
      updated: 'ticketing:team:updated',
      deleted: 'ticketing:team:deleted'
    },
    CLIENT: {
      created: 'ticketing:client:created',
      updated: 'ticketing:client:updated',
      deleted: 'ticketing:client:deleted'
    },
    FILTER: {
      created: 'ticketing:filter:created',
      updated: 'ticketing:filter:updated',
      deleted: 'ticketing:filter:deleted'
    },
    TICKET: {
      created: 'ticketing:ticket:created',
      updated: 'ticketing:ticket:updated',
      deleted: 'ticketing:ticket:deleted'
    },
    USER: {
      created: 'ticketing:user:created',
      updated: 'ticketing:user:updated',
      deleted: 'ticketing:user:deleted'
    }
  },
  TICKET_SETTABLE_TIMES: {
    workaround: 'workaround',
    correction: 'correction'
  },
  TICKET_ACTIVITY: {
    OBJECT_TYPE: 'ticket',
    VERBS: {
      update: 'update',
      set: 'set',
      unset: 'unset'
    }
  },
  NOTIFICATIONS: {
    updated: 'ticketing:notification:ticket:updated'
  }
};
