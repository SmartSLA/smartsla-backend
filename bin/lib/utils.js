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

module.exports = {
  dependencies
};

function dependencies(name) {
  return deps[name];
}
