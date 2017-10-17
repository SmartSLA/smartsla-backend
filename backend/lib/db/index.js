'use strict';

module.exports = dependencies => {

  const Organization = require('./organization')(dependencies);

  return {
    Organization
  };
};
