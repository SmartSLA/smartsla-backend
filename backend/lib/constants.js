'use strict';

module.exports = {
  ORDER_RIGHTS: {
    VIEW: 'view',
    SUBMIT: 'submit'
  },
  TICKETING_USER_ROLES: {
    ADMINISTRATOR: 'administrator',
    USER: 'user'
  },
  DEFAULT_LIST_OPTIONS: {
    OFFSET: 0,
    LIMIT: 50
  },
  ORDER_TYPES: ['USP', 'USPL', 'USL'],
  INDICES: {
    ORGANIZATION: {
      name: 'organizations.idx',
      type: 'organizations'
    }
  },
  EVENTS: {
    ORGANIZATION: {
      created: 'ticketing:organization:created',
      updated: 'ticketing:organization:updated',
      deleted: 'ticketing:organization:deleted'
    }
  }
};
