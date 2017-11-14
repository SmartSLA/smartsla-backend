'use strict';

module.exports = dependencies => {
  const organization = require('./organization')(dependencies);

  return {
    init
  };

  function init() {
    organization.registerListener();
  }
};
