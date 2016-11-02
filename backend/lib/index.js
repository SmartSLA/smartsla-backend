'use strict';

module.exports = function(dependencies) {

  const models = require('./db')(dependencies);
  const client = require('./client')(dependencies);
  const group = require('./group')(dependencies);

  return {
    client,
    group,
    models
  };
};
