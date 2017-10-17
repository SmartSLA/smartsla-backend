'use strict';

const CONSTANTS = require('./constants');

module.exports = {
  validateRight
};

function validateRight(right) {
  return Object.values(CONSTANTS.ORDER_RIGHTS).indexOf(right) > -1;
}
