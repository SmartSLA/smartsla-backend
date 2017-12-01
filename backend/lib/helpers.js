'use strict';

const _ = require('lodash');
const CONSTANTS = require('./constants');

module.exports = {
  validateOrderType,
  validateRight,
  validateUserRole,
  validateGlossaryCategory,
  uniqueDemands
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
