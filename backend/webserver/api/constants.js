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
  ID_OSSA_CONVERTION: {
    Blocking: 3,
    'Non-blocking': 2,
    Information: 1
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
