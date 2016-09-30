'use strict';

module.exports = function(dependencies) {

  const client = require('./client')(dependencies);

  return {
    client
  };
};
