'use strict';

const { dependencies } = require('./utils');

require('../../backend/lib/db/contract')(dependencies);
const contractLibModule = require('../../backend/lib/contract')(dependencies);

module.exports = {
  listByCursor
};

function listByCursor() {
  return contractLibModule.listByCursor();
}
