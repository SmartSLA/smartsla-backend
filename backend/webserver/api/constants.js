'use strict';

module.exports = {
  TICKET_SCOPES: {
    MINE: 'mine'
  },
  TICKET_ACTIONS: {
    updateState: 'updateState',
    set: 'set',
    unset: 'unset'
  },
  DEFAULT_TIMEZONE: 'Europe/Paris',
  CONTRIBUTION_STATUS_LIST: [
    'develop',
    'reversed',
    'published',
    'integrated',
    'rejected'
  ],
  TICKETING_USER_TYPES: {
    EXPERT: 'expert',
    BENEFICIARY: 'beneficiary'
  },
  LININFOSEC: {
    DEFAULT_MEETINGID: '1234', // TO DEFINE
    DEFAULT_CALLNUMBER: '0600000000', // TO DEFINE
    TICKET_STATUS: 'new',
    TYPE: 'softwareVulnerability'
  },
  LININFOSEC_SEVERITY_TYPES: {
    MAJOR: 'Major',
    MINOR: 'Minor',
    NONE: 'None'
  }
};
