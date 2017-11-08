'use strict';

const Q = require('q');
const mongoose = require('mongoose');
const commons = require('./commons');

module.exports = {
  connect,
  disconnect
};

function connect(config) {
  const defer = Q.defer();

  mongoose.connect(config.connectionString, function(err) {
    if (err) {
      return defer.reject(err);
    }

    commons.logInfo('Connected to MongoDB at', config.connectionString);
    defer.resolve();
  });

  return defer.promise;
}

function disconnect() {
  const defer = Q.defer();

  commons.logInfo('Disconnecting from MongoDB');
  mongoose.disconnect(function() {
    defer.resolve();
  });

  return defer.promise;
}
