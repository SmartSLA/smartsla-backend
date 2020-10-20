'use strict';

module.exports = {
  DEFAULT_LOCALE: 'fr',
  CONTRACTS_TYPES: {
    CREDIT: 'credit',
    UNLIMITED: 'unlimited'
  },
  EMAIL_NOTIFICATIONS: {
    DEFAULT_FROM: 'ossa@linagora.com',
    DEFAULT_RESPONSIBLE_EMAIL: 'ossa@linagora.com',
    TYPES: {
      CREATED: {
        subject: '#{{ticket.id}} {{{ticket.title}}}: issue #{{ticket.id}} has been created',
        template: 'ticket.created'
      },
      UPDATED: {
        subject: '#{{ticket.id}} {{{ticket.title}}}: issue #{{ticket.id}} has been updated',
        template: 'ticket.updated'
      },
      CONTRACT_EXPIRED: {
        subject: 'Contract {{{contractName}}} is expired',
        template: 'contract.expired'
      },
      CONTRACT_CREDITCONSUMED: {
        subject: 'Contract {{{contractName}}} has reached its credit limit',
        template: 'contract.creditconsumed'
      },
      USER_CREATED: {
        subject: 'Access to the support platform',
        template: 'user.created'
      }
    }
  },
  NOTIFICATIONS_TYPE: {
    EXPERT_ATTENDEES: 'expert_attendees',
    ALL_ATTENDEES: 'all_attendees'
  },
  TICKETING_USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    USER: 'user',
    EXPERT: 'expert',
    CUSTOMER: 'customer'
  },
  TICKETING_USER_TYPES: {
    EXPERT: 'expert',
    BENEFICIARY: 'beneficiary'
  },
  DEFAULT_LIST_OPTIONS: {
    OFFSET: 0,
    LIMIT: 1000,
    SORT: {
      SOFTWARE: '-timestamps.creation'
    }
  },
  GLOSSARY_CATEGORIES: {
    DEMAND_TYPE: 'Demand type',
    SOFTWARE_TYPE: 'Software type',
    ISSUE_TYPE: 'Issue type'
  },
  TICKET_STATUS: {
    NEW: 'new',
    SUPPORTED: 'supported',
    BYPASSED: 'bypassed',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  },
  USER_TYPE: {
    BENEFICIARY: 'beneficiary',
    EXPERT: 'expert'
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
    CONTRIBUTION: {
      created: 'ticketing:contribution:created',
      updated: 'ticketing:contribution:updated',
      deleted: 'ticketing:contribution:deleted'
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
  },
  TICKETING_CONTRACT_ROLES: {
    VIEWER: 'viewer',
    CUSTOMER: 'customer',
    OPERATIONAL_MANAGER: 'operational manager',
    CONTRACT_MANAGER: 'contract manager'
  },
  LIMESURVEY: {
    API_URL: 'http://localhost/index.php/admin/remotecontrol/',
    SURVEY_ID: 158386,
    CREDENTIALS: {
        username: 'admin',
        password: 'password'
    }
  },
  REQUEST_TYPE: {
    INFORMATION: 'Information',
    ADMINISTRATION: 'Administration',
    ANOMALY: 'Anomaly',
    OTHER: 'Other'
  },
  SOFTWARE_CRITICAL: {
    CRITICAL: 'critical',
    SENSIBLE: 'sensible',
    STANDARD: 'standard'
  },
  ALL_CONTRACTS: 'ALL_CONTRACTS'
};
