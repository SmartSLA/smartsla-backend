'use strict';

const mongoose = require('mongoose');
const dependencies = () => ({
  mongo: {
    mongoose
  }
});

require('../../backend/lib/db/organization')(dependencies);
const organizationLibModule = require('../../backend/lib/organization')(dependencies);

module.exports = {
  listByCursor
};

function listByCursor() {
  return organizationLibModule.listByCursor();
}
