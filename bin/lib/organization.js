'use strict';

const mongoose = require('mongoose');
const deps = {
  db: {
    mongo: {
      mongoose
    }
  },
  pubsub: {
    local: {
      topic: () => {}
    }
  }
};
const dependencies = name => {
  return deps[name];
};

require('../../backend/lib/db/organization')(dependencies);
const organizationLibModule = require('../../backend/lib/organization')(dependencies);

module.exports = {
  listByCursor
};

function listByCursor() {
  return organizationLibModule.listByCursor();
}
