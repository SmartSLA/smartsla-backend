'use strict';

const { dependencies } = require('./utils');

require('../../backend/lib/db/organization')(dependencies);
const organizationLibModule = require('../../backend/lib/organization')(dependencies);

module.exports = {
  listByCursor
};

function listByCursor() {
  return organizationLibModule.listByCursor();
}
