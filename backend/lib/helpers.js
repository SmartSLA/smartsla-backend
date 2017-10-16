'use strict';

const CONSTANTS = require('./constants');

module.exports = {
  validateRight,
  validateUserRole
};

function validateRight(right) {
  return Object.values(CONSTANTS.ORDER_RIGHTS).indexOf(right) > -1;
}

function validateUserRole(role) {
  return Object.values(CONSTANTS.TICKETING_USER_ROLES).indexOf(role) > -1;
}
