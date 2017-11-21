'use strict';

module.exports = dependencies => {
  const organization = require('./organization')(dependencies);
  const software = require('./software')(dependencies);

  return {
    init
  };

  function init() {
    organization.registerListener();
    software.registerListener();
  }
};
