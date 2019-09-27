'use strict';

const _ = require('lodash');
const CONSTANTS = require('./constants');

module.exports = {
  validateUserRole,
  validateGlossaryCategory,
  uniqueDemands,
  validateTicketState,
  isSuspendedTicketState
};

function validateUserRole(role) {
  return Object.values(CONSTANTS.TICKETING_USER_ROLES).indexOf(role) > -1;
}

function validateGlossaryCategory(category) {
  return Object.values(CONSTANTS.GLOSSARY_CATEGORIES).indexOf(category) > -1;
}

function uniqueDemands(demands) {
  const unique = _.uniqBy(demands, demand => [
    demand.demandType,
    demand.softwareType,
    demand.issueType
  ].join());

  return unique.length === demands.length;
}

function validateTicketState(state) {
  return Object.values(CONSTANTS.TICKET_STATUS).indexOf(state) > -1;
}

function isSuspendedTicketState(state) {
  return [CONSTANTS.TICKET_STATUS.BYPASSED,
          CONSTANTS.TICKET_STATUS.CLOSED].indexOf(state) > -1;
}
