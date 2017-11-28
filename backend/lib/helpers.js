'use strict';

const _ = require('lodash');
const CONSTANTS = require('./constants');

module.exports = {
  validateOrderType,
  validateRight,
  validateUserRole,
  validateGlossaryCategory,
  uniqueRequests
};

function validateRight(right) {
  return Object.values(CONSTANTS.ORDER_RIGHTS).indexOf(right) > -1;
}

function validateUserRole(role) {
  return Object.values(CONSTANTS.TICKETING_USER_ROLES).indexOf(role) > -1;
}

function validateOrderType(type) {
  return CONSTANTS.ORDER_TYPES.indexOf(type) > -1;
}

function validateGlossaryCategory(category) {
  return CONSTANTS.GLOSSARY_CATEGORIES.indexOf(category) > -1;
}

function uniqueRequests(requests) {
  const unique = _.uniqBy(requests, request => [
    request.requestType,
    request.softwareType,
    request.issueType
  ].join());

  return unique.length === requests.length;
}
