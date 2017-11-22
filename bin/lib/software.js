'use strict';

const { dependencies } = require('./utils');

require('../../backend/lib/db/software')(dependencies);
const softwareLibModule = require('../../backend/lib/software')(dependencies);

module.exports = {
  listByCursor
};

function listByCursor() {
  return softwareLibModule.listByCursor();
}
